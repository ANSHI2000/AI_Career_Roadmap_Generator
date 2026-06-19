import serverless from 'serverless-http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import app from '../src/app.js';
import User from '../src/models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai-career-roadmap';

const seedSuperAdmin = async () => {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;
  const name = process.env.SUPER_ADMIN_NAME || 'Super Admin';

  if (!email || !password) return;

  const existing = await User.findOne({ email }).select('+password');
  if (existing) {
    existing.role = 'admin';
    existing.isEmailVerified = true;
    existing.isVerified = true;
    existing.isActive = true;
    existing.verificationStatus = 'approved';
    existing.verifiedAt = existing.verifiedAt || new Date();
    await existing.save();
    console.log(`Super admin ready: ${email}`);
    return;
  }

  await User.create({
    name,
    email,
    password: await bcryptjs.hash(password, 10),
    role: 'admin',
    isEmailVerified: true,
    isVerified: true,
    isActive: true,
    verificationStatus: 'approved',
    verifiedAt: new Date(),
    approvalRequestDate: new Date(),
  });
  console.log(`Super admin seeded: ${email}`);
};

let cachedDb = null;

async function connectDB() {
  if (cachedDb && mongoose.connection.readyState === 1) return;
  
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Connected to MongoDB');
    await seedSuperAdmin();
    cachedDb = mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
}

const handler = serverless(app);

export default async function (req, res) {
  // Connect to DB on first request (cold start)
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
  
  return handler(req, res);
}
