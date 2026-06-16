import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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



export default app;
