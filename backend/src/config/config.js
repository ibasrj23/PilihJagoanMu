require("dotenv").config();

const config = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key-change-in-production",
  JWT_EXPIRE: "1d",
  NODE_ENV: process.env.NODE_ENV || "development",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
};

module.exports = config;
