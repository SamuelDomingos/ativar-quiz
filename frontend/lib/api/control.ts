export const controlQuiz = async (data: { idQuiz: string; status: string }) => {
  const response = await fetch("/api/control", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao controlar quiz");
  }

  return response.json();
};

export const quizControlQuestions = async (data: {
  idQuiz: string;
  action: string;
}) => {
  const response = await fetch(
    `/api/control/questions/${data.idQuiz}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: data.action }),
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao controlar perguntas do quiz");
  }
  return response.json();
};
