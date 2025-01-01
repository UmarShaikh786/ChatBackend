const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const socket = require('socket.io');

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Default Route
app.get('/', (req, res) => {
  res.send('Backend is running');
});
// Routes
app.use("/api/auth", require('./routes/userroutes'));
app.use("/api/messages", require('./routes/messagesroutes'));

// Server start
const server = app.listen(port, () => {
    console.log(`Server has started on port ${port}`);
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('open', () => {
    console.log("MongoDB Connected...");
});
db.on('error', (error) => { // Include the error parameter to log the actual error
    console.error("Error in Connection:", error);
});

// Socket.io setup
const io = socket(server, {
    cors: { 
        origin: "http://localhost:3000",
        credentials: true
    }
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    
    // Handle adding user to online users
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(`User added: ${userId} with socket id: ${socket.id}`);
    });

    // Handle sending messages
    socket.on("send-msg", (data) => {
        // console.log(data)
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.msg);
        }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        for (let [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                console.log(`User removed: ${userId}`);
                break;
            }
        }
    });
});
