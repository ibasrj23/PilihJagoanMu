# 🗳️ Pilih Jagoan Mu - Voting Platform

Platform pemilihan suara yang transparan, aman, dan real-time dengan fitur-fitur lengkap untuk berbagai jenis pemilihan.

## 🌟 Fitur Utama

### Authentication & Authorization
- ✅ Registrasi dan Login user
- ✅ 3 Role: Super Admin, Admin, dan Pengguna
- ✅ Role-based access control
- ✅ JWT Token authentication

### User Management
- ✅ Profile management (nama, username, email, telfon, alamat)
- ✅ Upload photo profil
- ✅ View voting history

### Election Management (Admin/Super Admin)
- ✅ Create/Edit/Delete pemilihan
- ✅ Set tanggal mulai dan berakhir
- ✅ Publicly atau privately pemilihan
- ✅ Berbagai tipe pemilihan (Kepala Desa, Bupati, Gubernur, dll)

### Candidate Management (Admin/Super Admin)
- ✅ Add/Edit/Delete kandidat
- ✅ Upload photo kandidat
- ✅ Visi dan Misi
- ✅ Pengalaman dan Pencapaian

### Voting System (User)
- ✅ Vote hanya sekali per pemilihan
- ✅ Real-time vote counting
- ✅ Lihat hasil voting secara live
- ✅ Riwayat voting pribadi

### Real-Time Features
- ✅ Real-time vote updates dengan Socket.IO
- ✅ Real-time notifications
- ✅ Live charts dan statistics
- ✅ Automatic data refresh

### Charts & Analytics
- ✅ Bar chart voting results
- ✅ Pie chart distribution
- ✅ Vote statistics
- ✅ Total votes dan participants counter

### Notifications
- ✅ Real-time notifications
- ✅ Election started/ended
- ✅ Vote confirmation
- ✅ Notification center

## 📋 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL dengan Sequelize ORM
- **Authentication**: JWT
- **Real-time**: Socket.IO
- **File Upload**: Multer
- **Validation**: Express Validator

### Frontend
- **Framework**: Next.js 13
- **UI Library**: React
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **Charts**: Recharts
- **Icons**: React Icons

## 🚀 Installation

### Prerequisites
- Node.js v14+
- MongoDB
- npm atau yarn

### Backend Setup

```bash
cd backend
npm install
```

Buat file `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pilih-jagoan-mu
JWT_SECRET=your-secret-key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Jalankan:
```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
```

Buat file `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

Jalankan:
```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `POST /api/auth/profile/photo` - Upload profile photo (protected)

### Election Endpoints
- `GET /api/elections` - Get all elections
- `GET /api/elections/:id` - Get election detail
- `POST /api/elections` - Create election (admin/super_admin)
- `PUT /api/elections/:id` - Update election (admin/super_admin)
- `DELETE /api/elections/:id` - Delete election (admin/super_admin)
- `GET /api/elections/:id/stats` - Get election statistics

### Candidate Endpoints
- `GET /api/candidates` - Get all candidates
- `GET /api/candidates/:id` - Get candidate detail
- `POST /api/candidates` - Create candidate (admin/super_admin)
- `PUT /api/candidates/:id` - Update candidate (admin/super_admin)
- `DELETE /api/candidates/:id` - Delete candidate (admin/super_admin)

### Vote Endpoints
- `POST /api/votes` - Submit vote (user, protected)
- `GET /api/votes/user-votes` - Get user votes (protected)
- `GET /api/votes/stats` - Get vote statistics
- `GET /api/votes/has-voted` - Check if user voted (protected)

### User Endpoints (Admin)
- `GET /api/users/admin/users` - Get all users (admin/super_admin)
- `PUT /api/users/admin/:id/role` - Update user role (super_admin)
- `PUT /api/users/admin/:id/status` - Toggle user status (super_admin)
- `DELETE /api/users/admin/:id` - Delete user (super_admin)

### Notification Endpoints
- `GET /api/users/notifications` - Get notifications (protected)
- `PUT /api/users/notifications/:id/read` - Mark as read (protected)
- `GET /api/users/notifications/unread/count` - Get unread count (protected)

## 🎭 User Roles & Permissions

### Super Admin
- ✅ Full access semua fitur
- ✅ Manage elections
- ✅ Manage candidates
- ✅ Manage users
- ✅ Ubah role user
- ✅ Nonaktifkan/aktifkan user
- ✅ Hapus user

### Admin
- ✅ Manage elections
- ✅ Manage candidates
- ✅ View statistics
- ✅ Tidak bisa manage user

### User
- ✅ View elections
- ✅ View candidates
- ✅ Vote di elections
- ✅ View personal statistics
- ✅ Edit profile
- ✅ Upload profile photo

## 📁 Project Structure

```
PilihJagoanMu/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── config.js
│   │   │   └── database.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Election.js
│   │   │   ├── Candidate.js
│   │   │   └── Notification.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── electionRoutes.js
│   │   │   ├── candidateRoutes.js
│   │   │   ├── voteRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── electionController.js
│   │   │   ├── candidateController.js
│   │   │   ├── voteController.js
│   │   │   └── userController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   └── server.js
│   ├── .env
│   ├── .gitignore
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index.jsx
│   │   │   ├── login.jsx
│   │   │   ├── register.jsx
│   │   │   ├── profile.jsx
│   │   │   ├── elections/
│   │   │   │   ├── index.jsx
│   │   │   │   └── [id].jsx
│   │   │   └── admin/
│   │   │       ├── index.jsx
│   │   │       └── elections/
│   │   │           └── create.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── CandidateCard.jsx
│   │   │   ├── VoteChart.jsx
│   │   │   └── NotificationCenter.jsx
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── socket.ts
│   │   │   └── store.ts
│   │   └── styles/
│   │       └── globals.css
│   ├── public/
│   ├── .env.local
│   ├── .gitignore
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
```

## 🔒 Security Features

- JWT token-based authentication
- Password hashing dengan bcryptjs
- CORS protection
- Role-based access control
- Input validation
- Protected routes

## 🚦 Getting Started

1. Clone repository
2. Setup backend & frontend sesuai instruksi di atas
3. Buka `http://localhost:3000` di browser
4. Register user baru
5. Login dan mulai voting!

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pilih-jagoan-mu
JWT_SECRET=your-secret-key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Pastikan MongoDB sudah berjalan di `localhost:27017`
- Atau update `MONGODB_URI` sesuai setup Anda

### CORS Error
- Update `FRONTEND_URL` di backend `.env`
- Update `NEXT_PUBLIC_API_URL` di frontend `.env.local`

### Socket.IO Connection Error
- Pastikan backend sudah berjalan
- Update `NEXT_PUBLIC_SOCKET_URL`

## 📄 License

MIT License

## 👨‍💻 Author

Created for Pilih Jagoan Mu Platform

---

**Selamat menggunakan Pilih Jagoan Mu! 🗳️✨**
