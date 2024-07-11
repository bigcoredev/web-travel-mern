import path from 'path';
import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js'
import uploadsRoutes from './routes/uploadsRoutes.js'
import postRoutes from './routes/postRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { Server } from 'socket.io';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express app
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/upload", uploadsRoutes);
app.use("/api/post", postRoutes);
app.use("/api/admin", adminRoutes);

// Serve static files
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);

// Setup Socket.io
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
  });
});
