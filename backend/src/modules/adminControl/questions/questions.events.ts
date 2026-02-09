import { Server, Socket } from "socket.io";
import { questionService } from "./questions.service";
import { getQuizMonitoringData } from "../../monitoring/monitoring.service";

export function registerQuestionEvents(io: Server, socket: Socket) {
  socket.on("question:start", async ({ quizId }) => {
    try {
      const result = await questionService.startQuestion(quizId);

      io.to(quizId).emit("question:started", {
        quizId,
        questionId: result.questionId,
        startedAt: result.startedAt,
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
      const result = await questionService.nextQuestion(quizId);

      if (result.finished) {
        io.to(quizId).emit("quiz:finished", { quizId });
        return;
      }

      io.to(quizId).emit("question:ready", {
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
