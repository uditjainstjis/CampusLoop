import mongoose from 'mongoose';

const SlotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Please provide the date for the session slot.'],
  },
  startTime: {
    type: String,
    required: [true, 'Please provide the start time.'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Use HH:mm format for time.'],
  },
  endTime: {
    type: String,
    required: [true, 'Please provide the end time.'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Use HH:mm format for time.'],
  },
}, { _id: false });

const MentorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide the name of the mentor.'],
    trim: true,
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
      validator: val => Array.isArray(val) && val.length > 0,
      message: 'Please provide at least one available slot.',
    }
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL for the mentor.'],
    trim: true,
    match: [/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|svg)$/, 'Please provide a valid image URL.'],
  },
  seniority:{
    type: Number,
    required: true
  }
}, { timestamps: true });

export default mongoose.models.Mentor || mongoose.model('Mentor', MentorSchema);
