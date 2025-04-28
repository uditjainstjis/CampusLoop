// src/lib/auth.config.js
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../lib/mongodb"; // Import the MongoDB client promise
import crypto from 'crypto'; // Import crypto for hashing comparison
import { ObjectId } from 'mongodb'; // Import ObjectId if needed for user ID handling (optional here)

// Helper to hash OTP (should match the one in send-otp route)
const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex');

export const authOptions = {
    // Configure the MongoDB Adapter with the client promise
    adapter: MongoDBAdapter(clientPromise),

    providers: [
        CredentialsProvider({
            name: "OTP",
            credentials: {
                mobileNumber: { label: "Mobile Number", type: "text" },
                otp: { label: "OTP", type: "text" },
                name: { label: "Name", type: "text" },    // Accept name from frontend
                email: { label: "Email", type: "email" }  // Accept email from frontend
            },
            async authorize(credentials, req) {
                const { mobileNumber, otp, name, email } = credentials; // Destructure all credentials

                if (!mobileNumber || !otp || !name) { // Name is required for verification step
                     // This error will be shown on the /auth/error page
                     throw new Error("Mobile number, OTP, and Name are required.");
                }

                try {
                   // Get the raw MongoDB client instance from the promise
                   const client = await clientPromise;
                   const db = client.db("test"); // Replace with your DB name
                   const usersCollection = db.collection("users"); // Assuming your users collection is named 'users'

                   // --- Find the user by mobile number ---
                   // Find the user document that initiated the OTP request

const user = await usersCollection.findOne({ mobileNumber: mobileNumber });

if (!user) {
    console.log("Authorize failed: User not found for mobile:", mobileNumber);
    throw new Error("Invalid mobile number or OTP."); // User wasn't found by mobile number
}

// --- Verify the OTP ---
const storedOtpInfo = user.otpInfo; // <--- Retrieve stored OTP info
const providedOtpHash = hashOtp(otp); // Hash the provided OTP

if (!storedOtpInfo || storedOtpInfo.code !== providedOtpHash) { // <--- Check stored vs provided
    console.log("Authorize failed: OTP mismatch for user:", mobileNumber);
    throw new Error("Invalid mobile number or OTP."); // OTP mismatch
}

if (new Date() > new Date(storedOtpInfo.expiresAt)) { // <--- Check expiry
    console.log("Authorize failed: OTP expired for user:", mobileNumber);
     await usersCollection.updateOne({ _id: user._id }, { $unset: { otpInfo: "" } });
    throw new Error("OTP expired. Please request a new one.");
}

                   // --- OTP is valid and not expired ---

                   // --- Update User with Name and Email and clear OTP info ---
                   const updateFields = {
                       name: name, // Always set/update name from the form
                       // Clear the OTP info after successful verification
                       otpInfo: "", // Set to empty string or null to unset
                       updatedAt: new Date() // Update timestamp
                   };

                   if (email !== undefined && email !== null && email !== '') { // Check if email was sent/entered
                      // You might add email format validation here
                      updateFields.email = email;
                   }

                   // Perform the update
                   const updateResult = await usersCollection.findOneAndUpdate(
                       { _id: user._id },
                       { $set: updateFields },
                       { returnDocument: 'after' } // Get the updated document
                   );

                   // Check if the update was successful and we got the updated document
                   if (!updateResult.value) {
                       console.error("Failed to get updated user document after auth for:", user._id);
                       // Decide how to handle this rare case. Can proceed with original user,
                       // but session might not reflect name/email immediately.
                   }

                   // Use the potentially updated user document for the session
                   const updatedUser = updateResult.value || user;


                   // --- Return the user object expected by NextAuth ---
                   // This object's properties (`id`, `name`, `email`, `image`)
                   // are what the adapter uses to create/update the Session in the DB
                   // and what gets put into the JWT/Session object.
                   return {
                       id: updatedUser._id.toString(), // MongoDB _id MUST be a string
                       name: updatedUser.name, // Include the name
                       email: updatedUser.email || null, // Include the email if present
                       image: updatedUser.image || null, // Include existing image if any
                       mobileNumber: updatedUser.mobileNumber, // Include mobile number in session user object
                   };

                } catch (error) {
                    console.error("Error during OTP authorization:", error);
                    // Re-throw specific errors with user-friendly messages
                    if (error.message.startsWith('Invalid') || error.message.startsWith('OTP expired') || error.message.startsWith('Mobile number, OTP, and Name')) {
                         throw error;
                    }
                    // For unexpected errors, throw a generic one
                    throw new Error("An internal error occurred during login. Please try again.");
                }
            }
        }),
        // You could add other providers here if needed, but for this flow, only Credentials
    ],
    session: {
        strategy: "jwt", // Using JWTs for session management
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
        // Callbacks to add custom fields to the JWT
         async encode({ secret, token }) {
            // Add custom fields from the token (populated in the decode callback)
             // or user object (first sign-in) to the encoded JWT payload if needed.
             // By default, name, email, image should be handled by the adapter/next-auth.
             // We might want to add the user ID explicitly.
             if (token.id) token.sub = token.id; // Ensure user ID is in 'sub' claim
             if (token.mobileNumber) token.mobileNumber = token.mobileNumber; // Keep mobile number

             const { encode } = require('next-auth/jwt'); // Import dynamically to avoid build errors
             return encode({ secret, token });
         },
         async decode({ secret, token }) {
            // Decode the JWT and add custom fields from the database if they aren't already present.
             const { decode } = require('next-auth/jwt'); // Import dynamically
             const decodedToken = await decode({ secret, token });

             // On subsequent requests, the token payload is decoded.
             // We can fetch additional user info from the DB if needed, e.g., roles.
             // For name, email, image, and mobileNumber, they should ideally be in the token already
             // because they were returned from the `authorize` function.
             // Example: If you needed to ensure mobileNumber is always on the token even if not in session user initially:
             if (decodedToken && decodedToken.sub && !decodedToken.mobileNumber) {
                try {
                    const client = await clientPromise;
                    const db = client.db("your_database_name");
                    const user = await db.collection("users").findOne({ _id: new ObjectId(decodedToken.sub) });
                    if (user) {
                        decodedToken.mobileNumber = user.mobileNumber;
                    }
                } catch (e) {
                    console.error("Error fetching user for JWT decode:", e);
                }
             }

            return decodedToken;
         }
    },
    // Redundant if jwt.secret is set, but harmless
    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        // JWT callback: receives the user object from `authorize` on sign-in
        // and the current token. Adds user info to the token.
        async jwt({ token, user }) {
             // 'user' is available the first time after a successful sign-in (from `authorize`)
             if (user) {
                token.id = user.id; // Add user id to the token
                // Add other custom fields returned by authorize function
                if (user.mobileNumber) token.mobileNumber = user.mobileNumber;
                // Name and Email from the user object should be automatically added by NextAuth/adapter
             }
             // For subsequent requests, user is undefined. Token is just decoded.
             return token;
        },
        // Session callback: receives the token and the current session object.
        // Adds info from the token to the session object exposed to the client via useSession.
        async session({ session, token }) {
            // 'token' is the object returned by the `jwt` callback
            // Add custom fields from the token to the session user object
            session.user.id = token.id; // Add user id
            if (token.mobileNumber) session.user.mobileNumber = token.mobileNumber; // Add mobile number
            // Name and Email should already be on session.user if they were in the token/database
            return session;
        }
    },
    pages: {
        signIn: '/signin',  // Custom sign-in page
        error: '/auth/error', // Custom error page to display authentication errors
        // verifyRequest: '/auth/verify-request', // Optional: for magic links, not OTP
    },
    // theme: { colorScheme: "dark" }, // Optional theme
};