import serverless from 'serverless-http';
import { connectDB } from '../src/db.js';

let serverlessHandler = null;

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  // 1. Connect to database (cached across invocations)
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection error:', error.message);
  }

  // 2. Lazy-load Express app and wrap it with serverless-http
  if (!serverlessHandler) {
    const { default: app } = await import('../src/app.js');
    serverlessHandler = serverless(app);
  }

  // 3. Forward request to Express via serverless-http
  return serverlessHandler(req, res);
}