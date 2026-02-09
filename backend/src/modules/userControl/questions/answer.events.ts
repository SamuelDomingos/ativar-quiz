import { Socket, Server } from "socket.io";
import { markAnswer } from "./answer.service";

export const setupAnswerHandlers = (io: Server, socket: Socket) => {
  socket.on("answer:submit", async (payload) => {
    try {
      await markAnswer(
        socket.data.sessionId,
        payload.questionId,
        payload.optionId
      );

      socket.emit("answer:confirmed");

    } catch (err: any) {
      socket.emit("answer:error", {
        message: err.message,
      });
    }
  });
};