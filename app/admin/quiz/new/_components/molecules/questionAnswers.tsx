import { Plus, Trash2 } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface QuestionAnswersProps {
  questionIndex: number;
  control: any;
  loading: boolean;
}

const QuestionAnswers = ({
  questionIndex,
  control,
  loading,
}: QuestionAnswersProps) => {
  const {
    fields: answers,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `questions.${questionIndex}.answers`,
  });

  return (
    <div className="space-y-4 border-t pt-6">
      <div className="flex items-center justify-between">
        <FormLabel className="text-base">Respostas *</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ text: "", isCorrect: false })}
          disabled={loading}
        >
          <Plus className="w-3 h-3 mr-1" />
          Adicionar Resposta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {answers.map((answer, answerIndex) => (
          <div
            key={answer.id || answerIndex}
            className="flex gap-2 items-center p-3 rounded-lg border border-border bg-secondary/50"
          >
            <FormField
              control={control}
              name={`questions.${questionIndex}.answers.${answerIndex}.text`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder={`Resposta ${answerIndex + 1}`}
                      {...field}
                      disabled={loading}
                      className="h-9"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`questions.${questionIndex}.answers.${answerIndex}.isCorrect`}
              render={({ field }) => (
                <FormItem className="flex items-center gap-1.5 shrink-0">
                  <Input
                    type="radio"
                    name={`correct-answer-${questionIndex}`}
                    checked={field.value}
                    onChange={(e) => {
                      for (let i = 0; i < answers.length; i++) {
                        if (i !== answerIndex) {
                          control.setValue(
                            `questions.${questionIndex}.answers.${i}.isCorrect`,
                            false,
                          );
                        }
                      }
                      field.onChange(e.target.checked);
                    }}
                    disabled={loading}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    Correta
                  </span>
                </FormItem>
              )}
            />

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(answerIndex)}
              disabled={loading || answers.length <= 2}
              className="h-9 w-9 p-0 shrink-0"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionAnswers;