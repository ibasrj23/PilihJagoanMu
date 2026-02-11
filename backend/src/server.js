const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const path = require("path");
const config = require("./config/config");
const { connectDB } = require("./config/database");

// Import routes
const authRoutes = require("./routes/authRoutes");
const electionRoutes = require("./routes/electionRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const voteRoutes = require("./routes/voteRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const server = http.createServer(app);

// Socket.IO configuration
const io = socketIO(server, {
  cors: {
    origin: config.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(
  cors({
    origin: config.FRONTEND_URL,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- FIX BAGIAN STATIC FILES ---
// Menggunakan path.resolve agar lebih aman dalam menentukan folder uploads
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));
// -------------------------------

// Database connection
connectDB().catch((err) => {
  console.error("Database connection failed:", err);
  process.exit(1);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/candidates", candidateRoutes);
app.use(
  "/api/votes",
  (req, res, next) => {
    req.io = io;
    next();
  },
  voteRoutes,
);
app.use("/api/users", userRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// Socket.IO events
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("vote:updated", (data) => {
    io.emit("vote:updated", data);
  });

  socket.on("election:created", (data) => {
    io.emit("election:created", data);
  });

  socket.on("notification:new", (data) => {
    io.emit("notification:new", data);
  });

  socket.on("join:election", (electionId) => {
    socket.join(`election:${electionId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route tidak ditemukan" });
});

// Start server
server.listen(config.PORT, () => {
  console.log(`Server berjalan di port ${config.PORT}`);
});

module.exports = { app, server, io };
