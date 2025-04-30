import { NextResponse } from 'next/server';
import clientPromise from "../../../lib/mongodb"; // Ensure this path is correct
import crypto from 'crypto';
import twilio from 'twilio';
import Mentor from '../../../models/Mentor'; // Import your Mentor model

// Load Twilio environment variables (ensure they are set in your .env.local)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsAppFromNumber = process.env.TWILIO_WHATSAPP_FROM_NUMBER || '+14155238886'; // Your Twilio WhatsApp number
const twilioOtpTemplateSid = process.env.TWILIO_OTP_TEMPLATE_SID || 'HXb5b62575e6e4ff6129ad7c7efe1f983e'; // Your Twilio Content API template SID

if (!accountSid || !authToken || !twilioWhatsAppFromNumber || !twilioOtpTemplateSid) {
    console.error("Missing Twilio environment variables!");
    // Consider throwing an error here or having a check on app startup
}

const twilioClient = twilio(accountSid, authToken);

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex');
const OTP_EXPIRY_MINUTES = 5;

export async function POST(req) {
    try {
        const body = await req.json();
        const { email } = body; // Expect email instead of mobileNumber

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Basic email format check (backend validation is important)
        const emailRegex = /^[\w-]+(?:\.[\w-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
             return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
        }

        console.log("Attempting to connect to MongoDB...");
        const client = await clientPromise;
        console.log("MongoDB client connected.");

        const dbName = "test"; // <<< REPLACE THIS with your database name
        console.log(`Attempting to access database: "${dbName}"`);
        const db = client.db(dbName);
        console.log(`Accessed database "${dbName}".`);

        // Use the Mentor model and collection
        const mentorsCollection = db.collection('mentors'); // Mongoose creates collection names lowercase and plural

        // Find the mentor by email
        const mentor = await mentorsCollection.findOne({ email: email.toLowerCase() });

        if (!mentor) {
            return NextResponse.json({ error: 'No mentor found with that email address.' }, { status: 404 });
        }

        // Ensure the mentor has a valid phone number for WhatsApp
        console.log(typeof mentor.number)
        if (!mentor.number) {
            console.error(`Mentor with email ${email} has an invalid or missing mobile number: ${mentor.number}`);
             return NextResponse.json({ error: 'Mentor profile has an invalid or missing phone number for WhatsApp OTP.' }, { status: 500 });
        }

        const otpCode = generateOtp();
        const hashedOtp = hashOtp(otpCode);
        const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

        // Update the mentor document with OTP info
        const filter = { _id: mentor._id }; // Use the found mentor's ID
        const updateDoc = {
             $set: {
                otpInfo: {
                    code: hashedOtp,
                    expiresAt: otpExpiresAt
                },
                 updatedAt: new Date()
            },
        };
        // No upsert here, we already verified the mentor exists
        const options = {
            returnDocument: 'after' // Return the document after update
        };

        console.log("Performing findOneAndUpdate to store OTP...");
        let updateResult = null;

        try {
            updateResult = await mentorsCollection.findOneAndUpdate(
                filter,
                updateDoc,
                options
            );
            console.log("findOneAndUpdate operation completed.");

        } catch (e) {
            console.error("ERROR caught during findOneAndUpdate for OTP storage:", e);
            throw e; // Re-throw to be caught by the main catch block
        }

        const updatedMentor = updateResult?.value;
         if (!updatedMentor) {
             console.error("findOneAndUpdate completed but did not return the mentor document after OTP storage.");
             // Continue sending OTP, but response won't have latest doc info if needed
         }


        // --- Send OTP via Twilio WhatsApp Content API ---
        const mentorWhatsAppNumber = mentor.number; // Use the number from the mentor document
        console.log(`Attempting to send OTP ${otpCode} to ${mentorWhatsAppNumber} via WhatsApp...`);
        try {
            const fromWhatsAppNumber = `whatsapp:${twilioWhatsAppFromNumber}`;
            const toWhatsAppNumber = `whatsapp:${mentorWhatsAppNumber}`;

            await twilioClient.messages.create({
                from: fromWhatsAppNumber,
                contentSid: twilioOtpTemplateSid,
                contentVariables: JSON.stringify({
                  "1": otpCode, // Pass the OTP code to the template
                }),
                to: toWhatsAppNumber,
            });
            console.log(`WhatsApp OTP successfully sent to ${mentorWhatsAppNumber}`);

        } catch (twilioError) {
            console.error('Twilio WhatsApp send error:', twilioError);
             // Specific error for Twilio failure
             return NextResponse.json({ error: 'Failed to send OTP via WhatsApp. Please try again.' }, { status: 500 });
        }
        // -------------------------------------------------------------

        console.log("API /api/mentor/send-otp completed successfully.");

        // Return success message. Do NOT return sensitive info like OTP code or hashed OTP.
        return NextResponse.json(
            {
                message: 'OTP sent successfully via WhatsApp to the mentor\'s registered number.',
                // You could return a non-sensitive identifier if needed for the verify step,
                // but using the email again in verify is simple.
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('API Catch Block Error in /api/mentor/send-otp:', error);
        // Provide a generic internal server error message to the client
        return NextResponse.json({ error: 'Internal Server Error occurred during OTP request.' + (error.message ? ' Details: ' + error.message : '') }, { status: 500 });
    }
}