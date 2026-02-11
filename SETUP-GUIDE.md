# 🚀 Setup Guide - Pilih Jagoan Mu Voting Platform

Panduan lengkap untuk setup dan menjalankan aplikasi Pilih Jagoan Mu.

## 📋 Requirement

- Node.js v14 atau lebih tinggi
- MySQL v5.7 atau lebih tinggi (atau MariaDB)
- npm atau yarn
- Text editor (VS Code recommended)

## 📦 Installation Step by Step

### Step 1: Setup MySQL Database

#### Setup Database
1. Buat database baru: `CREATE DATABASE pilih_jagoan_mu;`
2. Update konfigurasi di `.env` dengan kredensial MySQL Anda
   - `DB_HOST=localhost`
   - `DB_PORT=3306`
   - `DB_USER=root` (atau user MySQL Anda)
   - `DB_PASSWORD=` (password MySQL Anda)
   - `DB_NAME=pilih_jagoan_mu`

### Step 2: Setup Backend

```bash
# 1. Masuk ke folder backend
cd backend

# 2. Install dependencies
npm install

# 3. Buat file .env
# Windows (PowerShell)
echo "PORT=5000" > .env
echo "MONGODB_URI=mongodb://localhost:27017/pilih-jagoan-mu" >> .env
echo "JWT_SECRET=pilih-jagoan-mu-secret-key-2024" >> .env
echo "NODE_ENV=development" >> .env
echo "FRONTEND_URL=http://localhost:3000" >> .env

# Atau buat file manual .env dengan isi:
```

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pilih-jagoan-mu
JWT_SECRET=pilih-jagoan-mu-secret-key-2024
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

```bash
# 4. Jalankan backend
npm run dev
```

Backend akan berjalan di `http://localhost:5000`

### Step 3: Setup Frontend

```bash
# 1. Buka terminal baru, masuk ke folder frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Buat file .env.local
# Windows (PowerShell)
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
echo "NEXT_PUBLIC_SOCKET_URL=http://localhost:5000" >> .env.local

# Atau buat file manual .env.local dengan isi:
```

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

```bash
# 4. Jalankan frontend
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

## 🎯 First Time Setup

### 1. Akses Aplikasi
1. Buka browser: `http://localhost:3000`
2. Halaman home akan ditampilkan

### 2. Register User
1. Klik "Daftar"
2. Isi form dengan data:
   - Nama Lengkap: Masukkan nama Anda
   - Username: Nama unik untuk login
   - Email: Email aktif
   - Password: Minimal 6 karakter
3. Klik "Daftar"

### 3. Login
1. Klik "Login"
2. Masukkan email & password yang sudah didaftarkan
3. Klik "Login"

### 4. Create Admin User (Optional)

Untuk membuat user dengan role admin/super_admin, Anda perlu akses MongoDB:

```bash
# Connect ke MongoDB
mongosh

# Select database
use pilih-jagoan-mu

# Update user role
db.users.updateOne({email: "email@example.com"}, {$set: {role: "super_admin"}})
```

### 5. Mulai Voting

#### Sebagai Super Admin:
1. Login dengan akun super admin
2. Buka menu "Admin" di navbar
3. Klik "Buat Pemilihan"
4. Isi form dan submit
5. Add kandidat ke pemilihan
6. Set status pemilihan ke "active"

#### Sebagai User:
1. Login dengan akun user
2. Lihat pemilihan aktif di home
3. Pilih pemilihan
4. Pilih kandidat yang diinginkan
5. Lihat hasil voting real-time

## 🔧 Troubleshooting

### Error: MongoDB Connection Failed

**Solusi:**
1. Pastikan MongoDB sudah berjalan
2. Check MONGODB_URI di .env file
3. Coba koneksi dengan mongosh:
   ```bash
   mongosh "mongodb://localhost:27017"
   ```

### Error: CORS Error / Cannot connect to API

**Solusi:**
1. Check apakah backend sudah berjalan di port 5000
2. Update FRONTEND_URL di backend .env
3. Update NEXT_PUBLIC_API_URL di frontend .env.local
4. Restart kedua aplikasi

### Error: Socket.IO Connection Failed

**Solusi:**
1. Pastikan backend berjalan
2. Check NEXT_PUBLIC_SOCKET_URL di .env.local
3. Browser console akan menunjukkan error detail

### Port Already in Use

```bash
# Backend (port 5000)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Frontend (port 3000)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## 📚 Development Workflow

### Menambah Feature

1. Backend:
   ```bash
   # Buat model baru di src/models/
   # Buat controller di src/controllers/
   # Buat route di src/routes/
   # Add ke server.js
   ```

2. Frontend:
   ```bash
   # Buat component di src/components/
   # Buat page di src/pages/
   # Update store di src/lib/store.ts jika perlu
   ```

### Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 🚀 Production Deployment

### Backend (Node.js)

```bash
cd backend
npm install --production
npm start
```

Update .env untuk production:
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pilih-jagoan-mu
JWT_SECRET=your-strong-secret-key
FRONTEND_URL=https://yourdomain.com
```

### Frontend (Next.js)

```bash
cd frontend
npm run build
npm start
```

Update .env.production.local:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SOCKET_URL=https://api.yourdomain.com
```

## 📞 Support

Jika ada pertanyaan lakukan:
1. Check dokumentasi di README.md
2. Check API endpoints di backend README.md
3. Check components di frontend README.md

## ✅ Checklist

- [ ] MongoDB terinstall dan berjalan
- [ ] Backend dependency terinstall
- [ ] Frontend dependency terinstall
- [ ] Backend .env file sudah dibuat
- [ ] Frontend .env.local file sudah dibuat
- [ ] Backend berjalan di localhost:5000
- [ ] Frontend berjalan di localhost:3000
- [ ] Dapat login dengan akun yang terdaftar
- [ ] Dapat melihat home page dengan proper styling
- [ ] Real-time voting berfungsi

---

**Selamat! Aplikasi Anda sudah siap digunakan! 🎉**
