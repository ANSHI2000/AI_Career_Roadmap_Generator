import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/authRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import gapAnalysisRoutes from './routes/gapAnalysisRoutes.js';
import mentorRoutes from './routes/mentorRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import { authMiddleware } from './middleware/authMiddleware.js';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

const requireDatabase = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database is not connected. Start MongoDB or set MONGO_URI in backend/.env.',
    });
  }

  next();
};

// Auth routes
app.use('/api/auth', requireDatabase);
app.use('/api/auth', authRoutes);

app.use('/api/dashboard', requireDatabase, authMiddleware, dashboardRoutes);
app.use('/api/profile', requireDatabase, authMiddleware, profileRoutes);
app.use('/api/career', requireDatabase, authMiddleware, careerRoutes);
app.use('/api/skills', requireDatabase, authMiddleware, skillRoutes);
app.use('/api/gap-analysis', requireDatabase, authMiddleware, gapAnalysisRoutes);
app.use('/api/roadmap', requireDatabase, authMiddleware, roadmapRoutes);
app.use('/api/progress', requireDatabase, authMiddleware, progressRoutes);
app.use('/api/projects', requireDatabase, authMiddleware, projectRoutes);
app.use('/api/mentor', requireDatabase, authMiddleware, mentorRoutes);
app.use('/api/notifications', requireDatabase, authMiddleware, notificationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});



export default app;
