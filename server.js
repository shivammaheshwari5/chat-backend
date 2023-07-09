const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./backend/config/db");
const {
  notFound,
  errorHandle,
} = require("./backend/middleware/errorMiddleware");
const userRoute = require("./backend/router/userRouter");
const chatRoute = require("./backend/router/chatRouter");
const messageRoute = require("./backend/router/messageRouter");
const path = require("path");
dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);
app.get("/", (req, res) => {
  res.send("API is running and hello..");
});
app.get("/mine", (req, res) => {
  res.send("I love Sonam..");
});

// --------------------------deployment------------------------------

// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1, "/frontend/build")));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
//   );
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running..");
//   });
// }

// --------------------------deployment------------------------------
app.use(notFound);
app.use(errorHandle);
const PORT = process.env.PORT || 5001;
app.listen(PORT, console.log(`Server has started on ${PORT}`));
// const server = app.listen(PORT, console.log(`Server has started on ${PORT}`));

// const io = require("socket.io")(server, {
//   pingTimeout: 60000,
//   cors: {
//     origin: "http://localhost:3000",
//   },
// });

// io.on("connection", (socket) => {
//   console.log("connected to socket.io");

//   socket.on("setup", (userData) => {
//     socket.join(userData._id);
//     socket.emit("connected");
//   });

//   socket.on("join chat", (room) => {
//     socket.join(room);
//     console.log("user joined room:" + room);
//   });

//   socket.on("typing", (room) => socket.in(room).emit("typing"));
//   socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

//   socket.on("new message", (newMessageReceived) => {
//     var chat = newMessageReceived.chat;

//     if (!chat.users) return console.log("chat.users not defined");

//     chat.users.forEach((user) => {
//       if (user._id == newMessageReceived.sender._id) return;

//       socket.in(user._id).emit("message recieved", newMessageReceived);
//     });
//   });

//   socket.off("setup", () => {
//     console.log("USER DISCONNECTED");
//     socket.leave(userData._id);
//   });
// });
