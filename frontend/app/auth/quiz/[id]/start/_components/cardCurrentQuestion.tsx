import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { QuestionOption } from "@/lib/generated/prisma/client";

const CardCurrentQuestion = ({
  title,
  options,
  optionCounts,
}: {
  title: string;
  options: QuestionOption[];
  optionCounts: { optionId: string; count: number }[];
}) => {
  const totalAnswers = optionCounts.reduce((acc, o) => acc + o.count, 0);

  return (
    <Card className="border-border shadow-lg">
      <CardHeader className="pb-6 border-b border-border">
        <CardTitle className="text-2xl mb-2">{title}</CardTitle>
        <CardDescription>{totalAnswers} resposta{totalAnswers !== 1 ? "s" : ""} registrada{totalAnswers !== 1 ? "s" : ""}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-3">
        {options.map((option, index) => {
          const count = optionCounts.find((o) => o.optionId === option.id)?.count ?? 0;
          const percentage = totalAnswers > 0 ? Math.round((count / totalAnswers) * 100) : 0;

          return (
            <div key={option.id} className="w-full p-4 rounded-lg border-2 border-border bg-muted/30">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-8 h-8 rounded-full border-2 border-muted-foreground flex items-center justify-center font-bold text-muted-foreground">
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="font-medium text-base flex-1">{option.label}</span>
                <span className="text-sm font-semibold text-primary">{percentage}%</span>
              </div>
              <div className="flex items-center gap-3 ml-12">
                <Progress value={percentage} className="h-2 flex-1" />
                <span className="text-xs text-muted-foreground w-8 text-right">{count}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default CardCurrentQuestion;