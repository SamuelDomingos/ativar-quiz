import { Server, Socket } from "socket.io";
import { registerQuizEvents } from "./quiz/quiz.events";
import { registerQuestionEvents } from "./questions/questions.events";

export function registerSocketEventsAdmin(io: Server, socket: Socket) {
  registerQuizEvents(io, socket);
  registerQuestionEvents(io, socket);
}
