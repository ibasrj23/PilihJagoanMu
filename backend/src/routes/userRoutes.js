const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Protected routes
router.get('/notifications', authMiddleware, userController.getNotifications);
router.put('/notifications/:id/read', authMiddleware, userController.markAsRead);
router.get('/notifications/unread/count', authMiddleware, userController.getUnreadCount);

// Admin & Super Admin routes
router.get('/admin/users', authMiddleware, roleMiddleware(['admin', 'super_admin']), userController.getAllUsers);

// Super Admin only routes
router.put('/admin/:id/role', authMiddleware, roleMiddleware(['super_admin']), userController.updateUserRole);
router.put('/admin/:id/status', authMiddleware, roleMiddleware(['super_admin']), userController.toggleUserStatus);
router.delete('/admin/:id', authMiddleware, roleMiddleware(['super_admin']), userController.deleteUser);

module.exports = router;
