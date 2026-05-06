import Image from "next/image"

interface QuizInfoProps {
  title: string
  description: string
  coverUrl?: string
}

export function QuizInfo({ title, description, coverUrl }: QuizInfoProps) {
  return (
    <div className="mb-8 flex gap-20">
      {/* Imagem à esquerda */}
      {coverUrl && (
        <div className="shrink-0 overflow-hidden rounded-lg">
          <Image
            src={coverUrl}
            alt={title}
            width={200}
            height={200}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      
      {/* Textos à direita */}
      <div className="flex-1">
        <h2 className="text-xl font-bold text-foreground">
          {title}
        </h2>

        <p className="mt-4 text-sm leading-relaxed text-foreground">
          {description}
        </p>

        {/* Estatísticas */}
        <div className="mt-6 flex gap-6">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">
              Jogos
            </p>
            <p className="text-lg font-bold text-foreground">3k</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">
              Participantes
            </p>
            <p className="text-lg font-bold text-foreground">2.5k</p>
          </div>
        </div>
      </div>
    </div>
  )
}