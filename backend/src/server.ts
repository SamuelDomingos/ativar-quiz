import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import { registerSocketEventsAdmin } from "./modules/adminControl/registerEventsAdmin";
import { registerSocketEventsPlayer } from "./modules/userControl/registerEventsPlayer";
import { monitoringEvents } from "./modules/monitoring/monitoring.event";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  socket.on("quiz:join", (quizId) => {
    socket.join(quizId);
  });

  registerSocketEventsAdmin(io, socket);
  registerSocketEventsPlayer(io, socket);
  monitoringEvents(io, socket);
});

httpServer.listen(4000, () => {
  console.log("Realtime server rodando na porta 4000");
});