import Notification from '../models/Notification.js';

export const listNotifications = async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 10, 50);
  const query = { userId: req.userId };
  if (req.query.filter === 'Unread') query.isRead = false;
  if (req.query.type && !['All', 'Unread'].includes(req.query.type)) query.type = req.query.type;
  const [items, total] = await Promise.all([Notification.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit), Notification.countDocuments(query)]);
  res.json({ success: true, data: { items, total, page, pages: Math.ceil(total / limit) || 1 } });
};

export const unreadCount = async (req, res) => {
  const count = await Notification.countDocuments({ userId: req.userId, isRead: false });
  res.json({ success: true, data: { count } });
};

export const markRead = async (req, res) => {
  const item = await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { $set: { isRead: true } }, { new: true });
  res.json({ success: true, data: item });
};

export const markAllRead = async (req, res) => {
  await Notification.updateMany({ userId: req.userId }, { $set: { isRead: true } });
  res.json({ success: true, message: 'All notifications marked as read' });
};

export const deleteNotification = async (req, res) => {
  await Notification.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ success: true, message: 'Notification deleted' });
};
