# 🗳️ Pilih Jagoan Mu - Backend Server

Backend API server untuk platform voting Pilih Jagoan Mu.

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Setup
Buat file `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pilih-jagoan-mu
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Run
```bash
# Development
npm run dev

# Production
npm start
```

Server akan berjalan di `http://localhost:5000`

## 📚 API Endpoints

Lihat `README.md` di root project untuk dokumentasi lengkap API.

## 🏗️ Architecture

- **Express.js** - Web framework
- **MongoDB** - Database
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **Multer** - File upload handling

## 🔐 Middleware

- Authentication middleware untuk protected routes
- Role-based authorization middleware
- Input validation
- CORS handling

## 📦 Dependencies

- `express` - Web framework
- `sequelize` - MySQL ORM
- `mysql2` - MySQL database driver
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `socket.io` - Real-time communication
- `cors` - CORS handling
- `dotenv` - Environment variables
- `multer` - File upload
- `express-validator` - Input validation

## 📞 Support

Jika ada pertanyaan atau issue, silakan buat issue di repository.
