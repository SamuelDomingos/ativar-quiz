
import { Server, Socket } from "socket.io";
import { setupQuizHandlers } from "./quiz/player.events";
import { setupAnswerHandlers } from "./questions/answer.events";

export const registerSocketEventsPlayer = (io: Server, socket: Socket) => {
  setupQuizHandlers(io, socket);
  setupAnswerHandlers(io, socket);
};