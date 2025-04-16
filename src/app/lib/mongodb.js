import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    // console.log('🚀 Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable buffering for immediate error feedback
      // useNewUrlParser: true, // Deprecated but sometimes needed for older setups
      // useUnifiedTopology: true, // Deprecated but sometimes needed for older setups
    };

    // console.log('⏳ Creating new MongoDB connection promise');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      // console.log('✅ MongoDB Connected');
      return mongooseInstance;
    }).catch(error => {
        console.error('❌ MongoDB Connection Error:', error);
        cached.promise = null; // Reset promise on error
        throw error; // Re-throw error to be caught by API handler
    });
  }

  try {
    // console.log('⏳ Awaiting MongoDB connection promise');
    cached.conn = await cached.promise;
  } catch (e) {
      // If connection fails during await, nullify the promise and re-throw
      cached.promise = null;
      throw e;
  }

  return cached.conn;
}

export default dbConnect;