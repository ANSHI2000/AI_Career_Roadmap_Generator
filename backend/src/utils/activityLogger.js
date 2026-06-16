import Activity from '../models/Activity.js';

/**
 * Log user activity
 * @param {string} userId - User ID
 * @param {string} action - Action type
 * @param {string} description - Activity description
 * @param {string} link - Optional link to related resource
 * @param {object} metadata - Optional metadata
 */
export const logActivity = async (userId, action, description, link = '', metadata = {}) => {
  try {
    await Activity.create({
      userId,
      action,
      description,
      link,
      metadata,
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
    // Don't throw error, just log it
  }
};
