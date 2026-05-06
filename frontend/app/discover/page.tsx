import { Flame } from "lucide-react"
import { Carousel } from "./_components/Carousel"
import { QuizCard } from "./_components/detailsQuiz/quizCard"
import { Separator } from "@/components/ui/separator"
import { Quiz } from "@/lib/api/interfaces/quiz.interfaces"
import DetailsQuiz from "./_components/detailsQuiz"

const EXAMPLE_QUIZZES: Quiz[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    title: "História do Brasil",
    description:
      "Teste seus conhecimentos sobre os principais eventos da história brasileira",
    userId: "user-1",
    coverUrl:
      "https://images.unsplash.com/photo-1609708536965-9f8e28ce8e0f?w=500&h=300&fit=crop",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    title: "Capitais do Mundo",
    description:
      "Você conhece as capitais de todos os países? Descubra neste quiz desafiador",
    userId: "user-2",
    coverUrl:
      "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=500&h=300&fit=crop",
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    title: "Biologia - Sistema Imunológico",
    description: "Aprenda sobre como nosso corpo se defende de doenças",
    userId: "user-3",
    coverUrl:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=300&fit=crop",
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    title: "Literatura Clássica",
    description:
      "Teste suas conhecimentos sobre os grandes clássicos da literatura mundial",
    userId: "user-1",
    coverUrl:
      "https://images.unsplash.com/photo-150784272343-583f20270319?w=500&h=300&fit=crop",
    createdAt: new Date("2024-01-25"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    title: "Astronomia 101",
    description:
      "Explore o universo e descubra curiosidades fascinantes sobre planetas e estrelas",
    userId: "user-2",
    coverUrl:
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=500&h=300&fit=crop",
    createdAt: new Date("2024-01-22"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    title: "Python para Iniciantes",
    description:
      "Fundamentos de programação em Python - conceitos básicos e essenciais",
    userId: "user-3",
    coverUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    createdAt: new Date("2024-01-18"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440007",
    title: "Geografia Política",
    description:
      "Conheça mais sobre os países, fronteiras e características geopolíticas do mundo",
    userId: "user-1",
    coverUrl:
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=500&h=300&fit=crop",
    createdAt: new Date("2024-01-12"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440008",
    title: "Arte Renascentista",
    description:
      "Mergulhe no período de ouro da arte europeia e seus maiores mestres",
    userId: "user-2",
    coverUrl:
      "https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=500&h=300&fit=crop",
    createdAt: new Date("2024-01-28"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440009",
    title: "Química Orgânica",
    description: "Entenda as reações e estruturas dos compostos orgânicos",
    userId: "user-3",
    coverUrl:
      "https://images.unsplash.com/photo-1533684334900-ab72ffe2f107?w=500&h=300&fit=crop",
    createdAt: new Date("2024-01-16"),
  },
]

export default function DiscoverPage() {
  const trending = EXAMPLE_QUIZZES.slice(0, 10)

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="b relative mb-12 rounded-lg bg-primary/20 px-6 py-8">
        <h2 className="mb-4 flex items-center text-2xl font-bold text-chart-1">
          <Flame className="mr-2 text-chart-1" size={28} />
          Em alta na comunidade
        </h2>
        <Carousel items={trending} />
      </section>
      <Separator className="my-8" />

      <section>
        <h2 className="mb-6 flex items-center text-2xl font-bold text-chart-1">
          Descubra
        </h2>

        {EXAMPLE_QUIZZES.length === 0 ? (
          <p className="text-muted-foreground">Nenhum quiz disponível.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {EXAMPLE_QUIZZES.map((quiz) => (
              <DetailsQuiz
                key={quiz.id}
                quiz={quiz}
                trigger={<QuizCard quiz={quiz} />}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
