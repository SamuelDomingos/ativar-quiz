import { Server, Socket } from "socket.io";
import { questionService } from "./questions.service";
import { getQuizMonitoringData } from "../../monitoring/monitoring.service";

export function registerQuestionEvents(io: Server, socket: Socket) {
  socket.on("question:back", async ({ quizId }) => {
    try {
      const result = await questionService.actionQuestion(quizId, "back");

      io.to(quizId).emit("question:back", {
        quizId,
        questionId: result.questionId,
      });

      const monitoringData = await getQuizMonitoringData(quizId);
      io.to(quizId).emit("monitoring:quiz-data", monitoringData);
    } catch (error: any) {
      socket.emit("question:error", {
        message: error.message,
      });
    }
  });

  socket.on("question:next", async ({ quizId }) => {
    try {
      const result = await questionService.actionQuestion(quizId, "next");

      if (result && !result.ready) {
        io.to(quizId).emit("quiz:finished", { quizId });
        return;
      }

      io.to(quizId).emit("question:next", {
        quizId,
        questionId: result.questionId,
      });

      const monitoringData = await getQuizMonitoringData(quizId);
      io.to(quizId).emit("monitoring:quiz-data", monitoringData);
    } catch (error: any) {
      socket.emit("question:error", {
        message: error.message,
      });
    }
  });
}
