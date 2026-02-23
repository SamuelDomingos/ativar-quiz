import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Question, QuestionOption } from "@/lib/generated/prisma/client";
import { formatTime, getTimeColor } from "@/lib/utils";

const CardQuestion = ({
  currentQuestion,
  timeRemaining,
  selectAnswer,
  userAnswerOptionId,
}: {
  currentQuestion: Question & {
    options: QuestionOption[];
  };
  timeRemaining: number;
  selectAnswer: (optionId: string) => void;
  userAnswerOptionId?: string | null;
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
              {hasAnswered ? "Você já respondeu esta questão" : "Selecione uma opção abaixo"}
            </CardDescription>
          </div>
          {totalDuration > 0 && (
            <div className="flex flex-col items-center justify-center p-4 border border-border rounded-sm">
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">
                Tempo restante
              </p>
              <p className={`text-3xl font-bold tabular-nums transition-colors ${getTimeColor(timeRemaining, totalDuration)}`}>
                {formatTime(timeRemaining)}
              </p>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-3">
        {currentQuestion.options
          .sort((a: any, b: any) => a.order - b.order)
          .map((option: any, index: number) => {
            const isSelected = userAnswerOptionId === option.id;

            return (
              <button
                key={option.id}
                onClick={() => {
                  if (timeRemaining > 0) selectAnswer(option.id);
                }}
                disabled={timeRemaining === 0}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left
                  ${isSelected
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border hover:border-primary/50 hover:shadow-sm"
                  }
                  ${timeRemaining === 0 ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
                `}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold
                    ${isSelected
                      ? "border-primary bg-primary text-white"
                      : "border-muted-foreground text-muted-foreground"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="font-medium text-base flex-1">
                    {option.label}
                  </span>
                </div>
              </button>
            );
          })}
      </CardContent>
    </Card>
  );
};

export default CardQuestion;