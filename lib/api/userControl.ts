export const verificationQuiz = async (id: string) => {
  const response = await fetch(`/api/useControl?idQuiz=${id}`, {
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao verificar quiz");
  }

  return response.json();
};
