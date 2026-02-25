import { Socket, Server } from "socket.io";
import { markAnswer } from "./answer.service";
import { getQuizMonitoringData } from "../../monitoring/monitoring.service";
import { prisma } from "@/src/lib/prisma";

export const setupAnswerHandlers = (io: Server, socket: Socket) => {
  socket.on("answer:submit", async (payload) => {
    try {

      const result = await markAnswer(
        socket.data.sessionId,
        payload.questionId,
        payload.optionId,
      );

      if (result.session?.quizId) {
        socket.emit("answer:confirmed", {
          questionId: payload.questionId,
          optionId: payload.optionId,
          success: true,
          message: "Resposta registrada com sucesso",
        });

        const monitoringData = await getQuizMonitoringData(result.session.quizId);
        
        io.to(result.session.quizId).emit("monitoring:quiz-data", monitoringData);
      }
    } catch (err: any) {
      console.error("Erro ao submeter resposta:", err.message);
      
      socket.emit("answer:error", {
        message: err.message,
        success: false,
      });
    }
  });

  socket.on("answer:get-current", async (payload) => {
    try {
      const answer = await prisma.userAnswer.findUnique({
        where: {
          sessionId_questionId: {
            sessionId: socket.data.sessionId,
            questionId: payload.questionId,
          },
        },
      });

      socket.emit("answer:current", {
        questionId: payload.questionId,
        optionId: answer?.optionId || null,
        answeredAt: answer?.answeredAt || null,
      });
    } catch (err: any) {
      socket.emit("answer:error", {
        message: err.message,
      });
    }
  });
};