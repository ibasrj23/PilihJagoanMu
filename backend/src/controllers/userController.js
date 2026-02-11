const User = require('../models/User');
const Notification = require('../models/Notification');

// Super Admin & Admin only
exports.getAllUsers = async (req, res) => {
  try {
    const { role, isActive } = req.query;
    const where = {};

    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const users = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi error' });
  }
};

// Super Admin only
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    if (!['user', 'admin', 'super_admin'].includes(role)) {
      return res.status(400).json({ message: 'Role tidak valid' });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    await user.update({ role });

    const userData = user.toJSON();
    delete userData.password;

    res.json({
      message: 'Role user berhasil diubah',
      user: userData
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi error' });
  }
};

// Super Admin only
exports.toggleUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    await user.update({ isActive: !user.isActive });

    const userData = user.toJSON();
    delete userData.password;

    res.json({
      message: `User berhasil ${user.isActive ? 'diaktifkan' : 'dinonaktifkan'}`,
      user: userData
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi error' });
  }
};

// Super Admin only
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    await user.destroy();

    res.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi error' });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { isRead } = req.query;

    const where = { userId };
    if (isRead !== undefined) where.isRead = isRead === 'true';

    const notifications = await Notification.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi error' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;

    const notification = await Notification.findByPk(notificationId);

    if (!notification) {
      return res.status(404).json({ message: 'Notifikasi tidak ditemukan' });
    }

    await notification.update({ isRead: true });

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi error' });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await Notification.count({
      where: {
        userId,
        isRead: false
      }
    });

    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi error' });
  }
};
