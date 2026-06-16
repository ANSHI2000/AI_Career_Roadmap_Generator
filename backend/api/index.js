import app from '../src/app.js';
import { connectDB } from '../src/db.js';

// Disable Vercel's built-in body parser so multer can handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Ensure database is connected
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }

  // Forward the request to the Express app
  return app(req, res);
}
