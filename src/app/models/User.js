// src/app/models/User.js
import mongoose from 'mongoose';

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  // Mobile number will be the primary identifier for your OTP login
  mobileNumber: {
    type: String,
    required: true,
    unique: true, // Ensure each mobile number is unique
    index: true,  // Create an index for faster lookups
  },
  // Name collected during the second step of OTP login
  name: {
    type: String,
    required: true, // As per your form design
    trim: true, // Remove leading/trailing whitespace
  },
  // Email collected during the second step (optional)
  email: {
    type: String,
    required: false, // Email is optional
    // unique: true, // Make unique if you want emails to be unique
    // sparse: true, // Use sparse index if unique and optional
    lowercase: true, // Store email in lowercase
    trim: true,
  },
  // Field to temporarily store OTP information for verification
  otpInfo: {
    code: { // Stores the HASHED OTP code
      type: String,
      required: false, // Not required when user is not in OTP process
    },
    expiresAt: { // Stores the expiry timestamp of the OTP
      type: Date,
      required: false, // Not required when user is not in OTP process
    },
  },
  // The Next-Auth MongoDB adapter automatically adds/manages:
  // _id: ObjectId (primary key)
  // emailVerified: Date (used if you implement email verification flow, not OTP)
  // image: String (profile image URL)
  // accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }] (for linked accounts like Google, etc.)
  // sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }] (for managing sessions)
  // We don't need to define these explicitly if using the adapter,
  // but they will exist in the database documents.

}, {
  timestamps: true, // Adds createdAt and updatedAt fields automatically
});

// Add index for mobileNumber again just to be explicit
userSchema.index({ mobileNumber: 1 });

// Add index for email if you decided to make it unique+sparse
// userSchema.index({ email: 1 }, { unique: true, sparse: true });


// Prevent Mongoose from redefining the model on hot reloads in Next.js development
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;