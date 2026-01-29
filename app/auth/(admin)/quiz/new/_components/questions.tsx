import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import QuestionAnswers from "./molecules/questionAnswers";

interface QuestionsProps {
  form: any;
  questionIndex: number;
  question: any;
  questions: any[];
  remove: (index: number) => void;
  move: (from: number, to: number) => void;
  loading: boolean;
  deleteQuestionId: string | null;
  setDeleteQuestionId: (id: string | null) => void;
}

const Questions = ({
  form,
  questionIndex,
  question,
  questions,
  remove,
  move,
  loading,
  deleteQuestionId,
  setDeleteQuestionId,
}: QuestionsProps) => {
  const questionId = question.id || questionIndex.toString();

  return (
    <Card className="border-border shadow-lg overflow-hidden">
      <CardHeader className="bg-secondary/50 pb-3 flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-lg">Questão {questionIndex + 1}</CardTitle>
        </div>
        <div className="flex gap-2">
          {questionIndex > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => move(questionIndex, questionIndex - 1)}
              disabled={loading}
              title="Mover para cima"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
          )}
          {questionIndex < questions.length - 1 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => move(questionIndex, questionIndex + 1)}
              disabled={loading}
              title="Mover para baixo"
            >
              <ArrowDown className="w-4 h-4" />
            </Button>
          )}

          <AlertDialog
            open={deleteQuestionId === questionId}
            onOpenChange={(open) =>
              setDeleteQuestionId(open ? questionId : null)
            }
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setDeleteQuestionId(questionId)}
              disabled={loading}
              title="Deletar questão"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
            <AlertDialogContent>
              <AlertDialogTitle>Deletar questão?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. A questão será removida
                permanentemente.
              </AlertDialogDescription>
              <div className="flex gap-2 justify-end">
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    remove(questionIndex);
                    setDeleteQuestionId(null);
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Deletar
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <FormField
          control={form.control}
          name={`questions.${questionIndex}.title`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título da Questão *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite a pergunta"
                  {...field}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`questions.${questionIndex}.description`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Adicione mais contexto à questão"
                  rows={2}
                  {...field}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`questions.${questionIndex}.type`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Questão *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="multiple">Múltipla Escolha</SelectItem>
                    <SelectItem value="true-false">Verdadeiro/Falso</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`questions.${questionIndex}.timeLimit`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tempo Limite (segundos) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="5"
                    max="300"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <QuestionAnswers
          questionIndex={questionIndex}
          control={form.control}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
};

export default Questions;
