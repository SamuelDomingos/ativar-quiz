import { Socket, Server } from "socket.io";
import { markAnswer } from "./answer.service";
import { getQuizMonitoringData } from "../../monitoring/monitoring.service";
import { prisma } from "@/src/lib/prisma";

export const setupAnswerHandlers = (io: Server, socket: Socket) => {
  socket.on("answer:submit", async (payload) => {
    try {
      console.log("Received answer submission:", payload, socket.data.sessionId);

      // Marcar a resposta (create ou update)
      const result = await markAnswer(
        socket.data.sessionId,
        payload.questionId,
        payload.optionId,
      );

      // Se temos o quizId, atualizar monitoramento
      if (result.session?.quizId) {
        // Emitir confirmação para o usuário que respondeu
        socket.emit("answer:confirmed", {
          questionId: payload.questionId,
          optionId: payload.optionId,
          success: true,
          message: "Resposta registrada com sucesso",
        });

        // Buscar dados atualizados
        const monitoringData = await getQuizMonitoringData(result.session.quizId);
        
        // Emitir para TODOS na sala (admin vê atualização de respostas)
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