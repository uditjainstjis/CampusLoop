// src/app/api/user/send-otp/route.js
import { NextResponse } from 'next/server';
import clientPromise from "../../../lib/mongodb";
import crypto from 'crypto';
// import { ObjectId } from 'mongodb';
// import User from '@/app/models/User';

import twilio from 'twilio';
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsAppFromNumber = process.env.TWILIO_WHATSAPP_FROM_NUMBER || '+14155238886';
const twilioOtpTemplateSid = process.env.TWILIO_OTP_TEMPLATE_SID || 'HXb5b62575e6e4ff6129ad7c7efe1f983e';

if (!accountSid || !authToken || !twilioWhatsAppFromNumber || !twilioOtpTemplateSid) {
    console.error("Missing Twilio environment variables!");
}

const twilioClient = twilio(accountSid, authToken);

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex');
const OTP_EXPIRY_MINUTES = 5;

export async function POST(req) {
    try {
        const body = await req.json();
        const { mobileNumber } = body;

        if (!mobileNumber) {
            return NextResponse.json({ error: 'Mobile number is required' }, { status: 400 });
        }
        const mobileRegex = /^\+\d{10,15}$/;
        if (!mobileRegex.test(mobileNumber)) {
             return NextResponse.json({ error: 'Invalid mobile number format. Please include country code (e.g., +1234567890).' }, { status: 400 });
        }

        const otpCode = generateOtp();
        const hashedOtp = hashOtp(otpCode);
        const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

        console.log("Attempting to connect to MongoDB...");
        const client = await clientPromise;
        console.log("MongoDB client connected.");

        const dbName = "test"; // <<< REPLACE THIS
        console.log(`Attempting to access database: "${dbName}"`);
        const db = client.db(dbName);
        console.log(`Accessed database "${dbName}".`);

        const collectionName = "users";
        console.log(`Attempting to access collection: "${collectionName}"`);
        const usersCollection = db.collection(collectionName);
        console.log(`Accessed collection "${collectionName}".`);

        const filter = { mobileNumber: mobileNumber };
        const updateDoc = {
             $set: {
                otpInfo: {
                    code: hashedOtp,
                    expiresAt: otpExpiresAt
                },
                 updatedAt: new Date()
            },
             $setOnInsert: {
                createdAt: new Date(),
                // Name and email are NOT set here initially
             }
        };
        const options = {
            upsert: true, // Create if not found
            returnDocument: 'after' // Return the document AFTER update/insert
        };

        console.log("Performing findOneAndUpdate (upsert) operation...");
        let updateResult = null;

        try {
            updateResult = await usersCollection.findOneAndUpdate(
                filter,
                updateDoc,
                options
            );
            console.log("findOneAndUpdate operation completed.");
            // updateResult.value will be the document after upsert if returnDocument is 'after'

        } catch (e) {
            console.error("ERROR caught during findOneAndUpdate:", e);
            // Re-throw the error to be caught by the main catch block
            throw e;
        }

        // Check if we successfully got the document back from upsert
        const userDocument = updateResult?.value;
        if (!userDocument) {
             console.error("findOneAndUpdate completed but did not return the user document.");
             // This indicates a potential issue even if no error was thrown.
             // We might still try sending OTP, but the frontend won't get name/email info.
             // For now, we'll proceed but the response might be missing data.
        }


        // --- Send OTP via Twilio WhatsApp Content API ---
        console.log(`Attempting to send OTP ${otpCode} to ${mobileNumber} via WhatsApp...`);
        try {
            const fromWhatsAppNumber = `whatsapp:${twilioWhatsAppFromNumber}`;
            const toWhatsAppNumber = `whatsapp:${mobileNumber}`;

            await twilioClient.messages.create({
                from: fromWhatsAppNumber,
                contentSid: twilioOtpTemplateSid,
                contentVariables: JSON.stringify({
                  "1": otpCode,
                }),
                to: toWhatsAppNumber,
            });
            console.log(`WhatsApp OTP successfully sent to ${mobileNumber}`);

        } catch (twilioError) {
            console.error('Twilio WhatsApp send error:', twilioError);
             return NextResponse.json({ error: 'Failed to send OTP via WhatsApp. Please try again.' }, { status: 500 });
        }
        // -------------------------------------------------------------

        console.log("API /api/user/send-otp completed successfully.");
        // --- MODIFIED SUCCESS RESPONSE ---
        // Include name and email from the user document in the response
        return NextResponse.json(
            {
                message: 'OTP sent successfully via WhatsApp',
                // Pass name and email from the found/created user document
                name: userDocument?.name || null,
                email: userDocument?.email || null,
            },
            { status: 200 }
        );
        // --- END MODIFIED SUCCESS RESPONSE ---

    } catch (error) {
        console.error('API Catch Block Error in /api/user/send-otp:', error);
        return NextResponse.json({ error: 'Internal Server Error occurred.' + (error.message ? ' Details: ' + error.message : '') }, { status: 500 });
    }
}