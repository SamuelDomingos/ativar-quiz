export const joinQuiz = async (idQuiz: string, userName: string) => {
  const response = await fetch("/api/userControl", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idQuiz, userName }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao entrar no quiz");
  }
  return response.json();
};

export const verificationQuiz = async (id: string) => {
  const response = await fetch(`/api/userControl?idQuiz=${id}`, {
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao verificar quiz");
  }

  return response.json();
};

export const markAnswer = async (
  sessionId: string,
  questionId: string,
  optionId: string,
) => {
  const response = await fetch(`/api/userControl/questions/${questionId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId, optionId }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao marcar resposta");
  }
  return response.json();
};
