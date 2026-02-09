import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

export function QuestionResultCard({
  question,
  results,
  totalAnswered,
  totalUsers,
}) {
  const allAnswered = totalAnswered === totalUsers;
  const maxCount = Math.max(...results.map((r) => r.count), 0);

  return (
    <Card className="p-6 animate-fade-in">
      <h3 className="text-lg font-bold mb-6">{question.text}</h3>

      <div className="space-y-5">
        {results.map((result, idx) => {
          const isHighest =
            allAnswered && result.count === maxCount && result.count > 0;

          return (
            <div key={idx} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    isHighest ? "bg-teal-600" : "bg-slate-400"
                  }`}
                >
                  {result.count}
                </div>
                <span className="text-sm">{result.label}</span>
              </div>

              <div className="flex-1 h-8 bg-gray-300 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    isHighest ? "bg-teal-600" : "bg-gray-500"
                  }`}
                  style={{ width: `${result.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-xs text-gray-600 flex items-center gap-2">
        <Users className="w-4 h-4" />
        {totalAnswered} de {totalUsers} responderam
      </div>
    </Card>
  );
}
