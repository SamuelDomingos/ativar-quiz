import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";
import { toast } from "sonner";

export const useControl = (quizId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadControl = (command: "open" | "start" | "pause") => {
    setIsLoading(true);
    setError(null);

    const socket = getSocket();
    socket.emit("quiz:command", { quizId, command });
  };

  useEffect(() => {
    const socket = getSocket();

    socket.on("quiz:updated", () => {
      setIsLoading(false);
      toast.success("Quiz atualizado com sucesso!");
    });

    socket.on("quiz:error", (error) => {
      setIsLoading(false);
      setError(error.message);
      toast.error(`Erro ao controlar o quiz: ${error.message}`);
    });

    return () => {
      socket.off("quiz:updated");
      socket.off("quiz:error");
    };
  }, []);

  return {
    uploadControl,
    isLoading,
    error,
  };
};
