import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import app from './src/app.js';
import User from './src/models/User.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`SMTP host: ${process.env.SMTP_HOST || 'not configured'}`);
});

// Connect to MongoDB after the API starts so health checks and CORS can be tested
// even when a local database is not running yet.
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    return seedSuperAdmin();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    console.error('Set MONGO_URI in backend/.env to enable auth and saved user data.');
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('-----------------------------------------');
  console.error('FATAL: Unhandled Promise Rejection');
  console.error('Message:', error.message);
  if (error.errors) console.error('Validation Errors:', JSON.stringify(error.errors, null, 2));
  console.error('Stack:', error.stack);
  console.error('-----------------------------------------');
  process.exit(1);
});
