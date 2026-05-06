import { Question } from "@/lib/api/interfaces/question.interfaces"
import { Check } from "lucide-react"
import { colorMap } from "@/lib/IconMap"

export function QuestionCard({
  question: q,
  layout = "grid",
  showAnswers,
}: {
  question: Question
  layout?: "grid" | "list"
  showAnswers?: boolean
}) {
  if (layout === "grid") {
    return (
      <div className="relative overflow-hidden rounded border shadow-sm transition-shadow hover:shadow-md">
        {q.imageUrl && (
          <img
            src={q.imageUrl}
            alt={q.text}
            className="h-80 w-full object-cover"
          />
        )}
        <div className="absolute top-2 right-2 left-2 transform rounded-lg bg-card/60 p-4 shadow-lg">
          <h1 className="text-center text-base">{q.text}</h1>
        </div>
        <div className="absolute right-2 bottom-2 left-2 grid grid-cols-2 gap-1">
          {q.options?.map((option, index) => {
            const color = colorMap[index % colorMap.length]
            const Icon = color.icon

            return (
              <div
                key={option.id}
                className={`flex items-center justify-between gap-1 rounded-lg p-2 text-sm font-medium ${color.bg} text-white`}
              >
                <div className="flex items-center gap-1">
                  <Icon className="fill-current" size={15} />
                  {showAnswers && option.text}
                </div>
                {showAnswers && option.isCorrect && <Check size={15} />}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="relative inline-block w-full overflow-hidden rounded border shadow-sm transition-shadow hover:shadow-md">
      {q.imageUrl && (
        <img src={q.imageUrl} alt={q.text} className="w-full object-cover" />
      )}
      <div className="absolute top-3 right-3 left-3 transform rounded-lg bg-card/60 p-5 shadow-lg">
        <h1 className="text-center text-5xl font-medium">{q.text}</h1>
      </div>
      <div className="absolute right-3 bottom-3 left-3 grid grid-cols-2 gap-2">
        {q.options?.map((option, index) => {
          const color = colorMap[index % colorMap.length]
          const Icon = color.icon

          return (
            <div
              key={option.id}
              className={`flex items-center justify-between gap-2 rounded-lg p-4 text-3xl font-bold ${color.bg} text-white`}
            >
              <div className="flex items-center gap-2">
                <Icon className="fill-current" size={30} />
                {showAnswers && option.text}
              </div>

              {showAnswers && option.isCorrect && <Check size={30} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
