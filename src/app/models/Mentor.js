import mongoose from 'mongoose';

const SlotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Please provide the date for the session slot.'],
  },
  startTime: {
    type: String,
    required: [true, 'Please provide the start time.'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Use HH:mm format for time.']
  },
  endTime: {
    type: String,
    required: [true, 'Please provide the end time.'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Use HH:mm format for time.']
  }
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
  skills: {
    type: [String],
    required: [true, 'Please provide at least one skill.'],
    validate: [val => Array.isArray(val) && val.length > 0, 'Please provide at least one skill.']
  },
  about: {
    type: String,
    required: [true, 'Please describe the mentor.'],
    trim: true,
  },
  help: {
    type: [String],
    required: [true, 'Please describe how the mentor can help.'],
    validate: [val => Array.isArray(val) && val.length > 0, 'Please provide at least one help item.']
  },
  availability: {
    type: [SlotSchema],
    required: [true, 'Please provide availability.'],
    validate: [val => Array.isArray(val) && val.length > 0, 'Please provide at least one available slot.']
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL for the mentor.'],
    trim: true
  },
  rate: {
    type: Number,
    required: [true, 'Please provide an hourly rate for the mentor.'],
    min: [0, 'Rate cannot be negative.']
  }
}, { timestamps: true });

export default mongoose.models.Mentor || mongoose.model('Mentor', MentorSchema);
