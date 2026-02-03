import { useFetch } from "@/hooks/useFetch";
import { controlQuiz } from "@/lib/api/control";

export const useControl = () => {
  const {
    execute: uploadControl,
    data,
    isLoading,
    error,
  } = useFetch(controlQuiz, {
    successMessage: "Quiz atualizado com sucesso!",
    errorMessage: "Erro ao controlar o quiz!",
  });

  return {
    uploadControl,
    data,
    isLoading,
    error,
  };
};