import express from "express";
import logger from "morgan";
import { Server } from "socket.io";
import { createServer } from "node:http";

const port = process.env.PORT ?? 3000;

const app = express();

const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 10000,
  },
});
// io.on("connection", () => {
//   console.log("usuario conectado");
// });

io.on("disconnect", () => {
  console.log("usuario desconectado");
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

app.use(logger("dev"));

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/client/index.html");
});

server.listen(port, () => {
  console.log("server listening on port " + port);
});
