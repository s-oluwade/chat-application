const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');
const { faker } = require('@faker-js/faker');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // React frontend
    methods: ['GET', 'POST'],
  },
});

// const admin = require('firebase-admin');
// const serviceAccount = require('./path-to-service-account-key.json'); // Download from Firebase console

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

app.use(cors());
app.use(express.json());

// Store connected users
let connectedUsers = {};

io.on('connection', (socket) => {
  const randomUsername = faker.internet.username();

  if (!(socket.id in connectedUsers)) {
    connectedUsers[socket.id] = randomUsername;
    console.log(`User ${randomUsername} connected with ID ${socket.id}`);
    io.emit('broadcastMessage', `${randomUsername} joined the chat`);
    socket.emit('You are connected as: ', randomUsername);
  }
  console.log('Connected Users: \n' + connectedUsers);

  // Handle new message
  socket.on('message', (data) => {
    console.log('message from message received: ', data);
    socket.emit('receiveMessage', 'Message from message received: ' + data); // Broadcast message to all clients
    io.emit('broadcastMessage', `${randomUsername} said ${data}`);
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
