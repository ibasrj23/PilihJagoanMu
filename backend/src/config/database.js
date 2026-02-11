const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected successfully');
    
    // Import models after sequelize is authenticated
    const User = require('../models/User');
    const Election = require('../models/Election');
    const Candidate = require('../models/Candidate');
    const Vote = require('../models/Vote');
    const Notification = require('../models/Notification');

    // Create models object for associations
    const models = {
      User,
      Election,
      Candidate,
      Vote,
      Notification
    };

    // Initialize associations
    Object.values(models).forEach(model => {
      if (model.associate) {
        model.associate(models);
      }
    });

    await sequelize.sync({ alter: true });
    console.log('Database models synced');
  } catch (error) {
    console.error('MySQL connection error:', error);
    throw error;
  }
};

module.exports = { sequelize, connectDB };

