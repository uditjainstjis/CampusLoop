// src/lib/mongodb.js
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection promise across hot reloads
 * in development. This prevents connections growing exponentially.
 * We cache the promise that resolves to the raw MongoClient instance.
 */
let cached = global.mongoClientPromise;

if (!cached) {
  cached = global.mongoClientPromise = { conn: null, promise: null };
}

// If there's no cached connection promise, create one
if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s if cannot connect
      // Note: useNewUrlParser and useUnifiedTopology are deprecated in recent driver versions
      // You might add other MongoClient options here if needed
    };

    // Create a new MongoClient instance
    const client = new MongoClient(MONGODB_URI, opts);

    // Store the connection promise
    cached.promise = client.connect().catch(error => {
        console.error('❌ MongoDB (raw client) Connection Error:', error);
        // Ensure the promise is rejected correctly
        throw error;
    });

    // Optional: Store the resolved client instance once the promise resolves
    cached.promise.then(clientInstance => {
        cached.conn = clientInstance;
    });
}

// Export the promise that resolves to the MongoClient instance.
// The adapter and other server-side code will await this promise.
export default cached.promise;