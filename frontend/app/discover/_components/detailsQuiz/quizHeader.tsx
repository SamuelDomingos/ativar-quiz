import { Button } from "@/components/ui/button"
import { DrawerClose } from "@/components/ui/drawer"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface QuizHeaderProps {
  userId: string
}

export function QuizHeader({ userId }: QuizHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border px-6 py-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-chart-1 text-white">
            {userId.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <Button variant="link">
          <Link href="" className="text-sm text-white">
            {userId}
          </Link>
        </Button>
      </div>

      {/* Lado direito - Botões de navegação */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <DrawerClose asChild>
          <Button variant="ghost" size="icon">
            <X className="h-5 w-5" />
          </Button>
        </DrawerClose>
      </div>
    </div>
  )
}
