import { Button } from "@/components/ui/button"
import { ChevronRight, Projector, Send } from "lucide-react"

export function QuizActions() {
  return (
    <div className="w-80 shrink-0 overflow-y-auto px-6 py-6">
      <h3 className="mb-6 text-lg font-bold text-foreground">Sessão de Quiz</h3>

      <div className="space-y-3">
        <Button size="lg" className="flex w-full justify-between gap-2">
          <div className="flex items-center gap-2">
            <Projector className="h-5 w-5" />
            <span>Iniciar Quiz</span>
          </div>
          <ChevronRight className="h-5 w-5" />
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="flex w-full justify-between gap-2"
        >
          <div className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            <span>Compartilhar</span>
          </div>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
