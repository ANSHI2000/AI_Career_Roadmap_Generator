import express from 'express';
import cors from 'cors';
import { connectDB } from '../src/db.js';

// Import routes
import authRoutes from '../src/routes/authRoutes.js';
import careerRoutes from '../src/routes/careerRoutes.js';
import dashboardRoutes from '../src/routes/dashboardRoutes.js';
import gapAnalysisRoutes from '../src/routes/gapAnalysisRoutes.js';
import mentorRoutes from '../src/routes/mentorRoutes.js';
import notificationRoutes from '../src/routes/notificationRoutes.js';
import profileRoutes from '../src/routes/profileRoutes.js';
import progressRoutes from '../src/routes/progressRoutes.js';
import projectRoutes from '../src/routes/projectRoutes.js';
import roadmapRoutes from '../src/routes/roadmapRoutes.js';
import skillRoutes from '../src/routes/skillRoutes.js';
import { authMiddleware } from '../src/middleware/authMiddleware.js';

// Create the Express app (cached across invocations)
let app = null;

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

function createApp() {
  const app = express();

  // Middleware
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is running' });
  });

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/dashboard', authMiddleware, dashboardRoutes);
  app.use('/api/profile', authMiddleware, profileRoutes);
  app.use('/api/career', authMiddleware, careerRoutes);
  app.use('/api/skills', authMiddleware, skillRoutes);
  app.use('/api/gap-analysis', authMiddleware, gapAnalysisRoutes);
  app.use('/api/roadmap', authMiddleware, roadmapRoutes);
  app.use('/api/progress', authMiddleware, progressRoutes);
  app.use('/api/projects', authMiddleware, projectRoutes);
  app.use('/api/mentor', authMiddleware, mentorRoutes);
  app.use('/api/notifications', authMiddleware, notificationRoutes);

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

  return app;
}

export default async function handler(req, res) {
  // Connect to database
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection error:', error.message);
  }

  // Initialize app once
  if (!app) {
    app = createApp();
  }

  // Forward request to Express
  return app(req, res);
}