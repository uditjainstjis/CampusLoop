// src/app/models/Mentor.js
import mongoose from 'mongoose';

const SlotSchema = new mongoose.Schema({
  startTime: {
    type: Date, // Store as full Date object (ISODate in MongoDB)
    required: [true, 'Please provide the start time for the session slot.'],
  },
  endTime: {
    type: Date, // Store as full Date object (ISODate)
    required: [true, 'Please provide the end time for the session slot.'],
  },
}, { _id: false });

const MentorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide the name of the mentor.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide the email of the mentor.'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[\w-]+(?:\.[\w-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/, 'Please provide a valid email address.'],
  },
  number: {
    type: String,
    required: [true, 'Please provide the WhatsApp number (with country code) for the mentor.'],
    trim: true,
    match: [/^\+\d{10,15}$/, 'Please provide a valid mobile number format (e.g., +1234567890).'],
  },
  achievement: {
    type: String,
    default: '',
    trim: true,
  },
  about: {
    type: String,
    required: [true, 'Please describe the mentor.'],
    trim: true,
  },
  availability: {
    type: [SlotSchema],
    required: [true, 'Please provide availability.'],
    validate: {
      validator: val => Array.isArray(val),
      message: 'Availability must be an array.',
    }
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL for the mentor.'],
    trim: true,
    match: [/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|svg)$/, 'Please provide a valid image URL.'],
  },
  seniority: {
    type: Number,
    required: true
  },
  otpInfo: {
    code: String,
    expiresAt: Date,
  },
}, { timestamps: true });

export default mongoose.models.Mentor || mongoose.model('Mentor', MentorSchema);