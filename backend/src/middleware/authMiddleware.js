import { verifyToken } from '../utils/generateToken.js';
import User from '../models/User.js';

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please log in first.',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyToken(token);

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || 'Invalid or expired token',
    });
  }
};

export const authorize = (roles = []) => async (req, res, next) => {
  try {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Authenticated user not found' });
    }

    if (!user.isActive || !user.isVerified || user.verificationStatus !== 'approved') {
      return res.status(403).json({ success: false, message: 'Account is not approved for this action' });
    }

    if (allowedRoles.length && !allowedRoles.includes(user.role)) {
      return res.status(403).json({ success: false, message: 'You are not authorized to access this resource' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Authorization failed' });
  }
};
