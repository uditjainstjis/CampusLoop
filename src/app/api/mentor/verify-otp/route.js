import { NextResponse } from 'next/server';
import clientPromise from "../../../lib/mongodb"; // Ensure path is correct
import crypto from 'crypto';
import Mentor from '../../../models/Mentor'; // Import your Mentor model

// Use the same hashing logic
const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex');

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, otp } = body; // Expect email and otp

        if (!email || !otp) {
            return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
        }

        console.log("Attempting to connect to MongoDB...");
        const client = await clientPromise;
        console.log("MongoDB client connected.");

        const dbName = "test"; // <<< REPLACE THIS
        const db = client.db(dbName);
        const mentorsCollection = db.collection('mentors'); // Mongoose collection name

        // Find the mentor by email
        const mentor = await mentorsCollection.findOne({ email: email.toLowerCase() });

        if (!mentor) {
            // Be careful not to reveal if the email exists or not for security
            return NextResponse.json({ error: 'Invalid email or OTP.' }, { status: 401 }); // Use 401 Unauthorized
        }

        // Check if OTP info exists and is not expired
        if (!mentor.otpInfo || !mentor.otpInfo.code || !mentor.otpInfo.expiresAt) {
            return NextResponse.json({ error: 'No pending OTP found for this email.' }, { status: 400 }); // Maybe 400 or 401
        }

        const now = new Date();
        if (now > new Date(mentor.otpInfo.expiresAt)) {
            // Clear expired OTP info to prevent future attempts with it
             await mentorsCollection.updateOne(
                 { _id: mentor._id },
                 { $unset: { otpInfo: "" } } // Remove the otpInfo field
             );
            return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 401 });
        }

        // Verify the OTP
        const enteredHashedOtp = hashOtp(otp);
        if (enteredHashedOtp !== mentor.otpInfo.code) {
            // Do NOT clear OTP on failed attempt immediately to deter brute force,
            // but consider rate limiting or locking after multiple failed attempts.
            return NextResponse.json({ error: 'Invalid email or OTP.' }, { status: 401 });
        }

        // OTP is valid! Authentication successful.
        console.log(`Mentor ${mentor.email} successfully verified OTP.`);

        // --- SECURITY: Establish Authentication State ---
        // This is the crucial part. You need to tell the frontend that this mentor is logged in
        // and provide a way for subsequent requests to be authorized.

        // Option A (Simpler, less secure for API calls): Return the mentor's ID.
        // The frontend uses this ID to make requests to /api/mentor/[id].
        // **SECURITY RISK:** Anyone with a mentor ID could potentially access/modify that profile
        // if your API endpoints (/api/mentor/[id]) don't have further checks.
        // return NextResponse.json(
        //     { message: 'OTP verified successfully.', mentorId: mentor._id },
        //     { status: 200 }
        // );

        // Option B (More Robust): Implement Session management or JWT tokens.
        // 1. Create a session on the server (using libraries like next-auth, or manually). Store mentor._id in the session. Return a session ID (cookie) to the client.
        // 2. Or, generate a JWT token containing the mentor._id. Sign it with a secret key. Return the token to the client (e.g., in an HTTP-only cookie).
        // For subsequent protected API calls (e.g., GET/PUT /api/mentor/[id]), the frontend sends the session cookie or JWT. Your API middleware/handler verifies the token/session and checks if the mentor ID in the token/session matches the requested ID in the URL.

        // Example using a simple token (you'd replace this with a secure library)
        // For demonstration purposes, let's just return the ID for now, BUT understand the security implication.
        // A real application needs robust token/session handling.
        // Let's return the mentor ID and suggest using it securely.

        // --- Clear the used OTP info ---
        await mentorsCollection.updateOne(
            { _id: mentor._id },
            { $unset: { otpInfo: "" } } // Remove the otpInfo field after successful verification
        );
        // ------------------------------

        // In a real app, you would likely generate a JWT here and set it as an HttpOnly cookie
        // const jwt = require('jsonwebtoken'); // or similar library
        // const token = jwt.sign({ mentorId: mentor._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // const response = NextResponse.json({ message: 'OTP verified successfully.' }, { status: 200 });
        // response.cookies.set('mentor-auth-token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 60 * 60 }); // 1 hour expiry
        // return response;

        // Simple approach for now: return the mentor ID
        return NextResponse.json(
             { message: 'OTP verified successfully.', mentorId: mentor._id },
             { status: 200 }
        );


    } catch (error) {
        console.error('API Catch Block Error in /api/mentor/verify-otp:', error);
        return NextResponse.json({ error: 'Internal Server Error occurred during OTP verification.' + (error.message ? ' Details: ' + error.message : '') }, { status: 500 });
    }
}