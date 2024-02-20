const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { notFound, errorHandle } = require("./middleware/errorMiddleware");
const userRoute = require("./router/userRouter");
const chatRoute = require("./router/chatRouter");
const messageRoute = require("./router/messageRouter");
const cors = require("cors")
const path = require("path");
const Chat = require("./models/chatModel");
dotenv.config();
connectDB();
const app = express();
app.use(cors())
app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization, token");
  next();
});
app.get('/api/chats',async (req, res) => {
 const chat = await Chat.find({})
 res.json(chat)
})
  app.get("/", (req, res) => {
    res.send("API is running..");
  });

app.use(notFound);
app.use(errorHandle);
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server has started on ${PORT} and ${process.env.mongo_URI}`));
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://chat-frontend-sand.vercel.app",
    methods: ["GET", "POST", 'PUT'],
    credentials: true
  },
});
io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room:" + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageReceived);
    });
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
    // You might want to leave any rooms the user has joined here
  });
});
