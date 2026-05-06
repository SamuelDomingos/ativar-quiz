import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { colorMap } from "@/lib/IconMap"
import { Check, X } from "lucide-react"
import { Question } from "@/lib/api/interfaces/question.interfaces"

export function CompactCard({
  q,
  showAnswers,
}: {
  q: Question
  showAnswers?: boolean
}) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={q.id} className="rounded border">
        <AccordionTrigger className="flex items-center justify-between p-3 hover:bg-muted/30">
          <div className="flex items-center">
            {q.imageUrl && (
              <img
                src={q.imageUrl}
                alt={q.text}
                className="mr-3 h-12 flex-shrink-0 rounded object-cover"
              />
            )}
            <span className="text-sm font-medium">{q.text}</span>
          </div>
        </AccordionTrigger>

        <AccordionContent className="h-auto p-0">
          {q.options && q.options.length > 0 ? (
            <div className="space-y-0">
              {q.options.map((option, index) => {
                const color = colorMap[index % colorMap.length]
                const Icon = color.icon

                return (
                  <div key={option.id}>
                    <div className="flex items-center justify-between rounded-none p-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex items-center justify-center rounded p-1 ${color.bg}`}
                        >
                          <Icon className="fill-current text-white" size={13} />
                        </div>
                        <span className="text-xs font-medium text-foreground">
                          {showAnswers && option.text}
                        </span>
                      </div>
                      {showAnswers && option.isCorrect ? (
                        <Check size={16} className="text-primary" />
                      ) : (
                        showAnswers && (
                          <X size={16} className="text-destructive" />
                        )
                      )}
                    </div>
                    {index < q.options.length - 1 && <Separator />}
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="p-3 text-sm text-muted-foreground">
              Esta questão ainda não tem opções cadastradas.
            </p>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
