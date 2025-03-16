const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // React frontend
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Store connected users
let connectedUsers = new Map();

io.on('connection', (socket) => {

  if (!(socket.id in connectedUsers)) {
    console.log(`A new user connected with ID ${socket.id}`);
  }

  // Handle username assignment
  socket.on("username", (username) => {
    // if username exists in values, replace the key with new socket.id
    for (let [key, value] of connectedUsers.entries()) {
      if (value === username) {
          connectedUsers.delete(key); // Remove the old key
      }
    }

    connectedUsers.set(socket.id, username); // Add new key with the same value
    console.log(`User ${username} connected with ID ${socket.id}. Total users: ${connectedUsers.size}`);

    // Emit updated online user list
    io.emit("onlineUsers", Array.from(connectedUsers.values()));
  });

  // Handle messages
  socket.on('message', (message, callback) => {
    const sender = connectedUsers.get(socket.id) || "Unknown User";
    console.log(`${sender} sent a message: ${message}`);

    // Broadcast message to all clients
    io.emit("broadcastMessage", { sender, content: message });

    if (callback) callback();
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
