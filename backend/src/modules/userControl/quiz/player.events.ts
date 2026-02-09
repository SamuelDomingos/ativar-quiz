import { Socket, Server } from "socket.io";
import { joinQuizService } from "./joinQuiz.service";
import { getQuizMonitoringData } from "../../monitoring/monitoring.service";

export const setupQuizHandlers = (io: Server, socket: Socket) => {
  socket.on(
    "player:join",
    async ({ quizId, userName }: { quizId: string; userName: string }) => {
      try {
        const session = await joinQuizService({
          idQuiz: quizId,
          userName,
        });

        socket.join(quizId);
        socket.data.sessionId = session.id;

        io.to(quizId).emit("lobby:update");

        const monitoringData = await getQuizMonitoringData(quizId);
        io.to(quizId).emit("monitoring:quiz-data", monitoringData);

        socket.emit("player:joined", {
          sessionId: session.id,
        });
      } catch (err: any) {
        socket.emit("player:error", {
          message: err.message,
        });
      }
    },
  );
};
