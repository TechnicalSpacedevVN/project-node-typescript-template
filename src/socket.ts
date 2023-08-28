import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

let socketIds: any[] = [];

const room = "room";

io.on("connection", (socket) => {
  console.log("user connected with id", socket.id);

  socket.on("join room", () => {
    socket.join(room);
  });

  socket.on("sendToRoom", (msg) => {
    io.to(room).emit("client message", msg);
  });

  socketIds.push(socket.id);

  //   socket.on("event on server", (data) => {
  //     console.log(`data from client ${socket.id}`, data);
  //   });

  socket.on("message", (msg) => {
    let socketId = socketIds.find((e) => e !== socket.id);
    if (socketId) {
      io.to(socketId).emit("client message", msg);
    }
  });

  //   setInterval(() => {
  //     const data = { dataFromServer: Math.random() };
  //     console.log("data from server", data);
  //     socket.emit("client event", data);
  //   }, 3000);

  socket.on("disconnect", () => {
    socketIds = socketIds.filter((e) => e !== socket.id);
    console.log(`user with id ${socket.id} disconnected`);
  });
});

app.get("/test", (req, res) => {
  res.json({ test: true });
});

httpServer.listen(3003, () => {
  console.log("server start at http://localhost:3003");
});
