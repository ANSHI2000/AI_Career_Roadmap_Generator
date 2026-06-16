import mongoose from 'mongoose';

// Cache the database connection across serverless function invocations
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai-career-roadmap';

    cached.promise = mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    }).then((mongoose) => {
      console.log('Connected to MongoDB');
      return mongoose;
    }).catch((error) => {
      console.error('MongoDB connection error:', error.message);
      cached.promise = null;
      return null;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}