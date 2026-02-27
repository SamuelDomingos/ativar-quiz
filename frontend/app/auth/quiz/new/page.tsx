"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import BasicInformation from "./_components/basicInformation";
import Questions from "./_components/questions";
import { useCreateQuiz } from "../../_hooks/useAdmin";

const optionSchema = z.object({
  label: z.string().min(1, "Opção não pode estar vazia"),
  isCorrect: z.boolean(),
  order: z.number().min(1),
});

const questionSchema = z.object({
  title: z.string().min(1, "Título da questão é obrigatório"),
  type: z.enum(["TRUE_FALSE", "SINGLE_CHOICE"]),
  order: z.number().min(1),
  duration: z
    .number()
    .min(5, "Mínimo 5 segundos")
    .max(300, "Máximo 300 segundos"),
  options: z.array(optionSchema).min(2, "Mínimo 2 opções obrigatório"),
});

const quizSchema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
  description: z.string().optional(),
  questions: z.array(questionSchema).min(1, "Adicione no mínimo 1 questão"),
});

type QuizFormData = z.infer<typeof quizSchema>;

export default function NewQuizPage() {
  const router = useRouter();
  const { uploadData, isLoading: isUploadDataLoading } = useCreateQuiz();

  const [deleteQuestionId, setDeleteQuestionId] = useState<string | null>(null);

  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      description: "",
      questions: [
        {
          title: "",
          type: "TRUE_FALSE",
          order: 1,
          duration: 30,
          options: [
            { label: "", isCorrect: true, order: 1 },
            { label: "", isCorrect: false, order: 2 },
          ],
        },
      ],
    },
  });

  const {
    fields: questions,
    append,
    remove,
    move,
  } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const addQuestion = (): void => {
    append({
      title: "",
      type: "SINGLE_CHOICE",
      order: questions.length + 1,
      duration: 30,
      options: [
        { label: "", isCorrect: true, order: 1 },
        { label: "", isCorrect: false, order: 2 },
      ],
    });
  };

  const onSubmit = async (data: QuizFormData): Promise<void> => {
    const createdQuiz = await uploadData(data);

    if (createdQuiz) {
      router.push(`/auth/quiz/${createdQuiz.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Criar Novo Quiz
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Crie um novo quiz com questões e respostas
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-w-7xl mx-auto px-6 py-8">
            <BasicInformation form={form} loading={isUploadDataLoading} />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    Questões
                  </h2>
                </div>
                <Button
                  type="button"
                  onClick={addQuestion}
                  disabled={isUploadDataLoading}
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
                  loading={isUploadDataLoading}
                  deleteQuestionId={deleteQuestionId}
                  setDeleteQuestionId={setDeleteQuestionId}
                />
              ))}
            </div>

            <div className="flex gap-4 mt-8 sticky bottom-0 bg-background border-t border-border py-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isUploadDataLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isUploadDataLoading}
                className="flex-1 md:flex-none"
              >
                <Save className="w-4 h-4 mr-2" />
                {isUploadDataLoading ? "Salvando..." : "Criar Quiz"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
