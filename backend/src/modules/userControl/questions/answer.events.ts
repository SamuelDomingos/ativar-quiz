import { Socket, Server } from "socket.io";
import { markAnswer } from "./answer.service";
import { getQuizMonitoringData } from "../../monitoring/monitoring.service";

export const setupAnswerHandlers = (io: Server, socket: Socket) => {
  socket.on("answer:submit", async (payload) => {
    try {

      const session = await markAnswer(
        socket.data.sessionId,
        payload.questionId,
        payload.optionId,
      );

      socket.emit("answer:confirmed");

      if (session?.quizId) {
        const monitoringData = await getQuizMonitoringData(session.quizId);
        io.to(session.quizId).emit("monitoring:quiz-data", monitoringData);
      }
    } catch (err: any) {
      socket.emit("answer:error", {
        message: err.message,
      });
    }
  });
};