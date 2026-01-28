"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import BasicInformation from "./_components/basicInformation";
import Questions from "./_components/questions";

const answerSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, "Resposta não pode estar vazia"),
  isCorrect: z.boolean().default(false),
});

const questionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Título da questão é obrigatório"),
  description: z.string().optional(),
  type: z.enum(["multiple", "true-false"]),
  answers: z.array(answerSchema).min(2, "Mínimo 2 respostas obrigatório"),
  timeLimit: z.coerce
    .number()
    .min(5, "Mínimo 5 segundos")
    .max(300, "Máximo 300 segundos"),
});

const quizSchema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  category: z.string().min(1, "Categoria é obrigatória"),
  questions: z.array(questionSchema).min(1, "Adicione no mínimo 1 questão"),
  shuffleQuestions: z.boolean().default(false),
  shuffleAnswers: z.boolean().default(false),
  showFeedback: z.boolean().default(true),
});

type QuizFormData = z.infer<typeof quizSchema>;

export default function NewQuizPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [deleteQuestionId, setDeleteQuestionId] = useState<string | null>(null);

  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      questions: [
        {
          title: "",
          description: "",
          type: "multiple",
          answers: [
            { text: "", isCorrect: true },
            { text: "", isCorrect: false },
          ],
          timeLimit: 30,
        },
      ],
      shuffleQuestions: false,
      shuffleAnswers: true,
      showFeedback: true,
    },
  });

  const { fields: questions, append, remove, move } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      setTimeout(() => {
        // form.reset(fetchedData);
        setLoading(false);
      }, 500);
    }
  }, [id, isEditMode]);

  const onSubmit = async (data: QuizFormData) => {
    try {
      setLoading(true);
      console.log("Dados do formulário:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(
        isEditMode
          ? "Suas alterações foram salvas com sucesso"
          : "Seu novo quiz foi criado com sucesso",
        {
          description: isEditMode ? "Quiz atualizado" : "Quiz criado",
        }
      );

      router.push(`/admin/quiz/${id || "novo-id"}`);
    } catch (error) {
      toast.error("Ocorreu um erro ao salvar o quiz", {
        description: "Erro",
      });
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    append({
      title: "",
      description: "",
      type: "multiple",
      answers: [
        { text: "", isCorrect: true },
        { text: "", isCorrect: false },
      ],
      timeLimit: 30,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isEditMode ? "Editar Quiz" : "Criar Novo Quiz"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isEditMode
                ? "Atualize as informações do seu quiz"
                : "Crie um novo quiz com questões e respostas"}
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-w-7xl mx-auto px-6 py-8">
            <BasicInformation form={form} loading={loading} />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                    Questões
                  </h2>
                </div>
                <Button
                  type="button"
                  onClick={addQuestion}
                  disabled={loading}
                  size="lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Questão
                </Button>
              </div>

              {questions.map((question, questionIndex) => (
                <Questions
                  key={question.id || questionIndex}
                  form={form}
                  questionIndex={questionIndex}
                  question={question}
                  questions={questions}
                  remove={remove}
                  move={move}
                  loading={loading}
                  deleteQuestionId={deleteQuestionId}
                  setDeleteQuestionId={setDeleteQuestionId}
                />
              ))}
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-4 mt-8 sticky bottom-0 bg-background border-t border-border py-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 md:flex-none"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading
                  ? "Salvando..."
                  : isEditMode
                    ? "Atualizar Quiz"
                    : "Criar Quiz"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}