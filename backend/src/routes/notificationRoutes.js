import express from 'express';
import { deleteNotification, listNotifications, markAllRead, markRead, unreadCount } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', listNotifications);
router.get('/unread-count', unreadCount);
router.put('/read-all', markAllRead);
router.put('/:id/read', markRead);
router.delete('/:id', deleteNotification);

export default router;
