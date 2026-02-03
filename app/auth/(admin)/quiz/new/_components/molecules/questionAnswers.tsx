import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
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
  loading: boolean;
}

const QuestionAnswers = ({
  questionIndex,
  loading,
}: QuestionAnswersProps) => {
  const { control, setValue, watch } = useFormContext();
  const questionType = watch(`questions.${questionIndex}.type`);

  const {
    fields: options,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  const isMultipleChoice = questionType === "SINGLE_CHOICE";
  const isMaxOptionsReached = options.length >= 5;

  return (
    <div className="space-y-4 border-t pt-6">
      <div className="flex items-center justify-between">
        <FormLabel className="text-base">
          {questionType === "TRUE_FALSE" ? "Opções Fixas" : "Opções"} *
        </FormLabel>
        {isMultipleChoice && !isMaxOptionsReached && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({ label: "", isCorrect: false, order: options.length + 1 })
            }
            disabled={loading}
          >
            <Plus className="w-3 h-3 mr-1" />
            Adicionar Opção
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {options.map((option, optionIndex) => (
          <div
            key={option.id || optionIndex}
            className="flex gap-2 items-center p-3 rounded-lg border border-border bg-secondary/50"
          >
            <FormField
              control={control}
              name={`questions.${questionIndex}.options.${optionIndex}.label`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder={
                        questionType === "TRUE_FALSE"
                          ? optionIndex === 0
                            ? "Verdadeiro"
                            : "Falso"
                          : `Opção ${optionIndex + 1}`
                      }
                      {...field}
                      disabled={loading || questionType === "TRUE_FALSE"}
                      className="h-9"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`questions.${questionIndex}.options.${optionIndex}.isCorrect`}
              render={({ field }) => (
                <FormItem className="flex items-center gap-1.5 shrink-0">
                  <Input
                    type="radio"
                    name={`correct-answer-${questionIndex}`}
                    checked={field.value}
                    onChange={(e) => {
                      for (let i = 0; i < options.length; i++) {
                        if (i !== optionIndex) {
                          setValue(
                            `questions.${questionIndex}.options.${i}.isCorrect`,
                            false
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

            {isMultipleChoice && options.length > 2 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(optionIndex)}
                disabled={loading}
                className="h-9 w-9 p-0 shrink-0"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {isMaxOptionsReached && isMultipleChoice && (
        <p className="text-xs text-muted-foreground">
          Máximo de 5 opções atingido.
        </p>
      )}
    </div>
  );
};

export default QuestionAnswers;