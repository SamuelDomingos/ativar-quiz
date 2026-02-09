import { Server, Socket } from "socket.io";
import { getQuizMonitoringData } from "./monitoring.service";

export const monitoringEvents = (io: Server, socket: Socket) => {
  socket.on("monitoring:get-quiz-data", async ({ quizId }) => {
    try {
      const result = await getQuizMonitoringData(quizId);
      socket.emit("monitoring:quiz-data", result);
    } catch (err: any) {
      socket.emit("monitoring:error", {
        message: err.message,
      });
    }
  });
};
