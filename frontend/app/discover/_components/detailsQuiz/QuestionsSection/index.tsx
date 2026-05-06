"use client"

import { List, Grid3x3, Rows3, Eye, EyeOff } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState } from "react"

import type { Question } from "@/lib/api/interfaces/question.interfaces"
import { CompactCard } from "./compactCard"
import { QuestionCard } from "./questionCard"
import { Button } from "@/components/ui/button"

export function QuestionsSection({ questions }: { questions: Question[] }) {
  const [viewMode, setViewMode] = useState<"list" | "grid" | "compact">("list")
  const [showAnswers, setShowAnswers] = useState(false)

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">
          Perguntas ({questions.length})
        </h2>

        <div className="flex items-center gap-2">
          <Button
            variant="link"
            size="sm"
            onClick={() => setShowAnswers(!showAnswers)}
            className="flex items-center gap-2 text-white"
          >
            {showAnswers ? (
              <>
                <Eye className="h-4 w-4" />
                Ocultar respostas
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4" />
                Mostrar respostas
              </>
            )}
          </Button>

          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(v) => {
              if (v) setViewMode(v as "list" | "grid" | "compact")
            }}
            aria-label="Modo de visualização"
            variant="outline"
            defaultValue="list"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  className={
                    viewMode === "list"
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }
                  value="list"
                >
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mostrar itens em uma lista</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  className={
                    viewMode === "grid"
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }
                  value="grid"
                >
                  <Grid3x3 className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mostrar itens em uma grade</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  className={
                    viewMode === "compact"
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }
                  value="compact"
                >
                  <Rows3 className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mostrar itens em lista compacta</p>
              </TooltipContent>
            </Tooltip>
          </ToggleGroup>
        </div>
      </div>

      {viewMode === "list" && (
        <div className="space-y-6">
          {questions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              layout="list"
              showAnswers={showAnswers}
            />
          ))}
        </div>
      )}

      {viewMode === "grid" && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {questions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              layout="grid"
              showAnswers={showAnswers}
            />
          ))}
        </div>
      )}

      {viewMode === "compact" && (
        <div className="space-y-2">
          {questions.map((q) => (
            <CompactCard key={q.id} q={q} showAnswers={showAnswers} />
          ))}
        </div>
      )}
    </div>
  )
}
