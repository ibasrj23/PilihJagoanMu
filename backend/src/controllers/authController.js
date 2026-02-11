const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRE }
  );
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    // Validasi input
    if (!username || !email || !password || !fullName) {
      return res.status(400).json({ message: 'Semua field harus diisi' });
    }

    // Check user sudah ada
    const existingUser = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Email atau username sudah terdaftar' });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      fullName,
      role: 'user'
    });

    const token = generateToken(user);

    res.status(201).json({
      message: 'Registrasi berhasil',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi error saat registrasi' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password harus diisi' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Akun Anda telah dinonaktifkan' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login berhasil',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi error saat login' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.json(user.toJSON());
  } catch (error) {
    res.status(500).json({ message: 'Terjadi error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone, address, username } = req.body;
    const userId = req.user.id;

    // Check username tidak duplicate
    if (username) {
      const existingUser = await User.findOne({
        where: {
          username,
          id: { [require('sequelize').Op.ne]: userId }
        }
      });

      if (existingUser) {
        return res.status(409).json({ message: 'Username sudah digunakan' });
      }
    }

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (username) updateData.username = username;

    const user = await User.findByPk(userId);
    await user.update(updateData);

    res.json({
      message: 'Profil berhasil diperbarui',
      user: user.toJSON()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi error saat update profil' });
  }
};

exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File tidak ditemukan' });
    }

    const userId = req.user.id;
    const photoPath = `/uploads/profiles/${req.file.filename}`;

    const user = await User.findByPk(userId);
    await user.update({ profilePhoto: photoPath });

    res.json({
      message: 'Foto profil berhasil diupload',
      profilePhoto: photoPath,
      user: user.toJSON()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi error saat upload foto' });
  }
};
