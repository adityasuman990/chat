const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoute = require("./routes/messages");
const Url = "mongodb+srv://hunkyjunkymoose:aZdFnJaizGM8Hqmq@cluster0.wbl2z.mongodb.net/chat-app?retryWrites=true&w=majority&appName=Cluster0"
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);

mongoose
  .connect(Url, {
    
  })
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.log(err.message);
  });

const server = app.listen(5000, () => {
  console.log(`Server is running on 5000`);
});
app.get("/",(req,res)=>{
  res.send("server running");

});
const io = socket(server, {
  cors: {
    origin: "https://chat990.netlify.app/",
    credentials: true,
  },
});
global.onlineUsers = new Map();
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); // Broadcast to all users
  });
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});