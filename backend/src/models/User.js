const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
      validate: {
        len: [3, 100],
      },
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      defaultValue: '',
    },
    address: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    profilePhoto: {
      type: DataTypes.STRING(500),
      defaultValue: null,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin', 'super_admin'),
      defaultValue: 'user',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    tableName: 'users',
  }
);

// Hash password sebelum save
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

// Method untuk compare password
User.prototype.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// JSON representation tanpa password
User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

// Define associations
User.associate = (models) => {
  User.hasMany(models.Election, {
    foreignKey: 'createdBy',
    as: 'elections'
  });
  User.hasMany(models.Candidate, {
    foreignKey: 'createdBy',
    as: 'candidates'
  });
  User.hasMany(models.Vote, {
    foreignKey: 'userId',
    as: 'votes'
  });
  User.hasMany(models.Notification, {
    foreignKey: 'userId',
    as: 'notifications'
  });
};

module.exports = User;

