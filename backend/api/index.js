// Vercel serverless function entry point
// Uses raw Node.js http handling to avoid Express route matching issues on Vercel

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

  const url = req.url;
  const method = req.method;

  console.log(`Request: ${method} ${url}`);

  // Parse the URL to get the path
  const path = url.split('?')[0];

  // Route matching
  if (path === '/api/health' || path === '/api/health/') {
    return res.status(200).json({ success: true, message: 'Server is running' });
  }

  if (path === '/test' || path === '/test/') {
    return res.status(200).json({ success: true, message: 'Test works', url });
  }

  if (path === '/api/test' || path === '/api/test/') {
    return res.status(200).json({ success: true, message: 'API test works', url });
  }

  // If we get here, return 404 with debugging info
  return res.status(404).json({
    success: false,
    message: 'Route not found',
    url: url,
    path: path,
    method: method,
  });
}