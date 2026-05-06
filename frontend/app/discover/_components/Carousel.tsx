"use client"

import { Quiz } from "@/lib/api/interfaces/quiz.interfaces"
import { QuizCard } from "./detailsQuiz/quizCard"
import {
  Carousel as ShadCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import DetailsQuiz from "./detailsQuiz"

export function Carousel({ items }: { items: Quiz[] }) {
  return (
    <ShadCarousel
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
      opts={{
        align: "start",
        loop: true,
        slidesToScroll: 4,
      }}
      className="w-full"
    >
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />

      <CarouselContent className="-ml-1">
        {items.map((quiz) => (
          <CarouselItem key={quiz.id} className="md:basis-1/2 lg:basis-1/4">
            <DetailsQuiz
              key={quiz.id}
              quiz={quiz}
              trigger={<QuizCard quiz={quiz} />}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </ShadCarousel>
  )
}
