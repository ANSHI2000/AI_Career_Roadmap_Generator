import Notification from '../models/Notification.js';

/**
 * Create notification for user
 * @param {string} userId - User ID
 * @param {string} type - Notification type
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} link - Optional link
 * @param {object} metadata - Optional metadata
 */
export const createNotification = async (userId, type, title, message, link = '', metadata = {}) => {
  try {
    await Notification.create({
      userId,
      type,
      title,
      message,
      link,
      metadata,
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
    // Don't throw error, just log it
  }
};
