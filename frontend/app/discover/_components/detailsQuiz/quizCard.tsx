import Image from "next/image"
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Quiz } from "@/lib/api/interfaces/quiz.interfaces"

export function QuizCard({ quiz }: { quiz: Quiz }) {
  return (
    <Card className="h-full overflow-hidden p-0 transition-shadow hover:shadow-lg">
      {quiz.coverUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={quiz.coverUrl}
            alt={quiz.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardContent className="pb-3">
        <CardTitle className="text-lg font-semibold">{quiz.title}</CardTitle>
        <CardDescription className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {quiz.description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}
