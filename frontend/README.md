# 🗳️ Pilih Jagoan Mu - Frontend Application

Frontend React/Next.js untuk platform voting Pilih Jagoan Mu.

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Setup
Buat file `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### Run
```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start
```

Frontend akan berjalan di `http://localhost:3000`

## 🌐 Pages

- `/` - Home page
- `/login` - Login page
- `/register` - Register page
- `/profile` - User profile
- `/elections` - Daftar semua pemilihan
- `/elections/[id]` - Detail pemilihan
- `/admin` - Admin dashboard
- `/admin/elections/create` - Create election (admin)

## 🎨 Components

- `Navbar` - Navigation bar
- `Card` - Reusable card component
- `CandidateCard` - Candidate display card
- `VoteChart` - Voting statistics chart
- `NotificationCenter` - Notification panel

## 📦 Dependencies

- `next` - React framework
- `react` - UI library
- `tailwindcss` - CSS framework
- `axios` - HTTP client
- `socket.io-client` - Real-time client
- `recharts` - Chart library
- `zustand` - State management
- `react-icons` - Icons library

## 🔑 State Management

Menggunakan **Zustand** untuk state management:
- `useAuthStore` - Authentication & user state

## 🌐 API Integration

Menggunakan **Axios** dengan interceptors untuk:
- Automatic token injection ke headers
- Error handling

## 🔌 Real-time

Menggunakan **Socket.IO** untuk:
- Real-time vote updates
- Live notifications
- Instant data refresh

## 📞 Support

Jika ada pertanyaan atau issue, silakan buat issue di repository.
