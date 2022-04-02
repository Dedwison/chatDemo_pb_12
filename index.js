const { urlencoded } = require("express");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { formatMessage } = require("./utils/utils");

const PORT = process.env.PORT || 8080;

const app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer);

const messages = [];
const users = [];

// Middleware
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(express.static("./public"));

// Routes
app.post("/login", (req, res) => {
  const { username } = req.body;
  res.redirect(`/chat?username=${username}`);
});

app.get("/chat", (req, res) => {
  res.sendFile(__dirname + "/public/chat.html");
});

// Listen
httpServer.listen(PORT, () => {
  console.log("Server is up anf running on port: ", PORT);
});

// Socket Events
const botName = "shut bot";
io.on("connection", (socket) => {
  console.log("New client conection!");

  //Send Messages
  socket.emit("messages", [...messages]);

  // Join Chat
  socket.on("join-chat", ({ username }) => {
    const newUser = {
      id: socket.id,
      username,
    };
    users.push(newUser);

    // Welcome current user
    socket.emit(
      "chat-message",
      formatMessage(null, botName, "Wecome to shut App!")
    );

    // Boadcast connection
    socket.broadcast.emit(
      "chat-message",
      formatMessage(null, botName, `${username} has joined the chat`)
    );
  });
  socket.on("new-message", (msg) => {
    const user = users.find((user) => user.id === socket.id);
    const newMessage = formatMessage(socket.id, user.username, msg);
    messages.push(newMessage);
    io.emit("chat-message", newMessage);
  });
});
