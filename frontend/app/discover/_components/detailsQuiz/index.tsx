import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Quiz } from "@/lib/api/interfaces/quiz.interfaces"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { QuizHeader } from "./quizHeader"
import { QuizInfo } from "./quizInfo"
import { QuizActions } from "./quizactions"
import { Question } from "@/lib/api/interfaces/question.interfaces"
import { ScrollArea } from "@/components/ui/scroll-area"
import { QuestionsSection } from "./QuestionsSection"

interface DetailsQuizProps {
  trigger: React.ReactNode
  quiz: Quiz
}

const exemploDeQuestoes: Question[] = [
  {
    id: "quiz-1-q1",
    text: "Qual é a capital da França?",
    type: "SINGLE",
    imageUrl:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600",
    options: [
      {
        id: "opt-1",
        text: "Londres",
        isCorrect: false,
        questionId: "quiz-1-q1",
        createdAt: "2024-01-01T12:00:00.000Z",
      },
      {
        id: "opt-2",
        text: "Paris",
        isCorrect: true,
        questionId: "quiz-1-q1",
        createdAt: "2024-01-01T12:00:00.000Z",
      },
      {
        id: "opt-3",
        text: "Berlim",
        isCorrect: false,
        questionId: "quiz-1-q1",
        createdAt: "2024-01-01T12:00:00.000Z",
      },
      {
        id: "opt-4",
        text: "Madrid",
        isCorrect: false,
        questionId: "quiz-1-q1",
        createdAt: "2024-01-01T12:00:00.000Z",
      },
    ],
    quizId: "quiz-1",
    createdAt: "2024-01-01T12:00:00.000Z",
    updatedAt: "2024-01-01T12:00:00.000Z",
  },
  {
    id: "quiz-1-q2",
    text: "Selecione as cores primárias.",
    type: "MULTIPLE",
    imageUrl:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600",
    options: [
      {
        id: "opt-5",
        text: "Vermelho",
        isCorrect: true,
        questionId: "quiz-1-q2",
        createdAt: "2024-01-01T12:01:00.000Z",
      },
      {
        id: "opt-6",
        text: "Azul",
        isCorrect: true,
        questionId: "quiz-1-q2",
        createdAt: "2024-01-01T12:01:00.000Z",
      },
      {
        id: "opt-7",
        text: "Verde",
        isCorrect: false,
        questionId: "quiz-1-q2",
        createdAt: "2024-01-01T12:01:00.000Z",
      },
      {
        id: "opt-8",
        text: "Amarelo",
        isCorrect: true,
        questionId: "quiz-1-q2",
        createdAt: "2024-01-01T12:01:00.000Z",
      },
    ],
    quizId: "quiz-1",
    createdAt: "2024-01-01T12:01:00.000Z",
    updatedAt: "2024-01-01T12:01:00.000Z",
  },
  {
    id: "quiz-1-q3",
    text: "Qual animal é conhecido como o rei da selva?",
    type: "SINGLE",
    imageUrl:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600",
    options: [
      {
        id: "opt-9",
        text: "Leão",
        isCorrect: true,
        questionId: "quiz-1-q3",
        createdAt: "2024-01-01T12:02:00.000Z",
      },
      {
        id: "opt-10",
        text: "Elefante",
        isCorrect: false,
        questionId: "quiz-1-q3",
        createdAt: "2024-01-01T12:02:00.000Z",
      },
      {
        id: "opt-11",
        text: "Tigre",
        isCorrect: false,
        questionId: "quiz-1-q3",
        createdAt: "2024-01-01T12:02:00.000Z",
      },
      {
        id: "opt-12",
        text: "Girafa",
        isCorrect: false,
        questionId: "quiz-1-q3",
        createdAt: "2024-01-01T12:02:00.000Z",
      },
    ],
    quizId: "quiz-1",
    createdAt: "2024-01-01T12:02:00.000Z",
    updatedAt: "2024-01-01T12:02:00.000Z",
  },
  {
    id: "quiz-1-q4",
    text: "Qual das seguintes linguagens é tipada estaticamente?",
    type: "SINGLE",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600",
    options: [
      {
        id: "opt-13",
        text: "JavaScript",
        isCorrect: false,
        questionId: "quiz-1-q4",
        createdAt: "2024-01-01T12:03:00.000Z",
      },
      {
        id: "opt-14",
        text: "TypeScript",
        isCorrect: true,
        questionId: "quiz-1-q4",
        createdAt: "2024-01-01T12:03:00.000Z",
      },
      {
        id: "opt-15",
        text: "Python",
        isCorrect: false,
        questionId: "quiz-1-q4",
        createdAt: "2024-01-01T12:03:00.000Z",
      },
      {
        id: "opt-16",
        text: "Ruby",
        isCorrect: false,
        questionId: "quiz-1-q4",
        createdAt: "2024-01-01T12:03:00.000Z",
      },
    ],
    quizId: "quiz-1",
    createdAt: "2024-01-01T12:03:00.000Z",
    updatedAt: "2024-01-01T12:03:00.000Z",
  },
  {
    id: "quiz-1-q5",
    text: "Qual desses elementos químicos tem símbolo Fe?",
    type: "SINGLE",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600",
    options: [
      {
        id: "opt-17",
        text: "Ouro",
        isCorrect: false,
        questionId: "quiz-1-q5",
        createdAt: "2024-01-01T12:04:00.000Z",
      },
      {
        id: "opt-18",
        text: "Ferro",
        isCorrect: true,
        questionId: "quiz-1-q5",
        createdAt: "2024-01-01T12:04:00.000Z",
      },
      {
        id: "opt-19",
        text: "Prata",
        isCorrect: false,
        questionId: "quiz-1-q5",
        createdAt: "2024-01-01T12:04:00.000Z",
      },
      {
        id: "opt-20",
        text: "Cobre",
        isCorrect: false,
        questionId: "quiz-1-q5",
        createdAt: "2024-01-01T12:04:00.000Z",
      },
    ],
    quizId: "quiz-1",
    createdAt: "2024-01-01T12:04:00.000Z",
    updatedAt: "2024-01-01T12:04:00.000Z",
  },
]

const DetailsQuiz = ({ trigger, quiz }: DetailsQuizProps) => {
  if (!quiz) return <>{trigger}</>

  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent
        className="flex h-[90vh] flex-col"
        style={{ height: "95vh", maxHeight: "95vh" }}
      >
        <VisuallyHidden>
          <DrawerTitle>{quiz.title}</DrawerTitle>
        </VisuallyHidden>

        <QuizHeader userId={quiz.userId} />

        <div className="flex flex-1 justify-center gap-6 overflow-hidden">
          <ScrollArea className="h-full max-w-7xl flex-1">
            <div className="px-6 py-6 pr-4">
              <QuizInfo
                title={quiz.title}
                description={quiz.description}
                coverUrl={quiz.coverUrl}
              />
              <QuestionsSection questions={exemploDeQuestoes} />
            </div>
          </ScrollArea>

          <div className="w-80 border-l border-border">
            <QuizActions />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default DetailsQuiz
