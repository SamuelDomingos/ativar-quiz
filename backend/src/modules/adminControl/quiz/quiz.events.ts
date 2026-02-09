import { Server, Socket } from "socket.io";
import { quizService } from "./quiz.service";
import { getQuizMonitoringData } from "../../monitoring/monitoring.service";

export function registerQuizEvents(io: Server, socket: Socket) {
  socket.on("quiz:command", async ({ quizId, command }) => {
    try {
      const result = await quizService({
        idQuiz: quizId,
        command,
      });

      io.to(quizId).emit("quiz:updated", {
        quizId,
        ...result,
      });

      const monitoringData = await getQuizMonitoringData(quizId);
      io.to(quizId).emit("monitoring:quiz-data", monitoringData);
    } catch (error: any) {
      socket.emit("quiz:error", {
        message: error.message,
      });
    }
  });
}
