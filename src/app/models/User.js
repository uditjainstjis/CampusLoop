
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    emailVerified: Date,
    image: String,
    provider: {
      type: String,
      default: 'google',
    },
    googleId: String,
    role: {
      type: String,
      enum: ['user', 'mentor', 'admin'],
      default: 'user',
    },
    category: {
      type: String,
      enum: ['senior', 'teacher'],
      required: function() { return this.role === 'mentor'; }
    },
    bio: String,
    expertise: [String],
    pricing: {
      firstYear: Number,
      secondYear: Number,
      faculty: Number
    },
    availability: [
      {
        day: String,
        startTime: String,
        endTime: String,
      },
    ],
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model('User', userSchema);
