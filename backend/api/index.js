// Vercel serverless function entry point
// Handles all API routes without Express

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url, method } = req;
  const path = url.split('?')[0];

  console.log(`Request: ${method} ${path}`);

  // Root URL - show API info
  if (path === '/' || path === '') {
    return res.status(200).json({
      success: true,
      message: 'Backend API is running',
      endpoints: {
        health: '/api/health',
        test: '/api/test',
        auth: '/api/auth/*',
        dashboard: '/api/dashboard/*',
        profile: '/api/profile/*',
        career: '/api/career/*',
        skills: '/api/skills/*',
        'gap-analysis': '/api/gap-analysis/*',
        roadmap: '/api/roadmap/*',
        progress: '/api/progress/*',
        projects: '/api/projects/*',
        mentor: '/api/mentor/*',
        notifications: '/api/notifications/*',
      },
    });
  }

  if (path === '/api/health' || path === '/api/health/') {
    return res.status(200).json({ success: true, message: 'Server is running' });
  }

  if (path === '/test' || path === '/test/') {
    return res.status(200).json({ success: true, message: 'Test works' });
  }

  if (path === '/api/test' || path === '/api/test/') {
    return res.status(200).json({ success: true, message: 'API test works' });
  }

  return res.status(404).json({
    success: false,
    message: 'Route not found',
    path: path,
    method: method,
    tip: 'Try /api/health or /api/test',
  });
}