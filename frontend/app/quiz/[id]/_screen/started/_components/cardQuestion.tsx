import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Question, QuestionOption } from "@/lib/generated/prisma/client";
import { formatTime, getTimeColor } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

const CardQuestion = ({
  currentQuestion,
  timeRemaining,
  selectAnswer,
  userAnswerOptionId,
  isSubmitting = false,
}: {
  currentQuestion: Question & {
    options: QuestionOption[];
  };
  timeRemaining: number;
  selectAnswer: (optionId: string) => void;
  userAnswerOptionId?: string | null;
  isSubmitting?: boolean;
}) => {
  const totalDuration = currentQuestion.duration ?? 0;
  const hasAnswered = !!userAnswerOptionId;

  return (
    <Card className="border-border shadow-lg mb-6">
      <CardHeader className="pb-6 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2">
              {currentQuestion.title}
            </CardTitle>
            <CardDescription>
              {hasAnswered
                ? "Você já respondeu esta questão"
                : "Selecione uma opção abaixo"}
            </CardDescription>
          </div>
          {totalDuration > 0 && (
            <div className="flex flex-col items-center justify-center p-4 border border-border rounded-sm">
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">
                Tempo restante
              </p>
              <p
                className={`text-3xl font-bold tabular-nums transition-colors ${getTimeColor(timeRemaining, totalDuration)}`}
              >
                {formatTime(timeRemaining)}
              </p>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-3">
        {currentQuestion.options.map((option) => (
          <button
            key={option.id}
            onClick={() => selectAnswer(option.id)}
            disabled={timeRemaining <= 0}
            className={`
    w-full p-4 rounded-lg border-2 transition-all text-left font-medium
    flex items-center justify-between
    ${
      userAnswerOptionId === option.id
        ? "border-primary bg-primary/10 text-primary"
        : "border-border bg-background text-foreground hover:border-muted-foreground"
    }
    ${timeRemaining <= 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
  `}
          >
            <span>{option.label}</span>

            {userAnswerOptionId === option.id && (
              <div className="flex items-center gap-2">
                {isSubmitting && (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                )}
                {!isSubmitting && hasAnswered && (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                )}
                {!isSubmitting && !hasAnswered && (
                  <span className="text-primary font-bold">✓</span>
                )}
              </div>
            )}
          </button>
        ))}
      </CardContent>
    </Card>
  );
};

export default CardQuestion;
