import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, LogIn, Compass, Plus, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function Header() {
  return (
    <header
      className={cn(
        "flex items-center justify-between p-4",
        "bg-primary text-primary-foreground"
      )}
    >
      <nav className="flex gap-2">
        <Link href="/discover" passHref>
          <Button
            variant="secondary"
            className="flex items-center gap-1 text-primary-foreground"
          >
            <Compass size={16} />
            Descobrir
          </Button>
        </Link>
        <Button
          variant="secondary"
          className="flex items-center gap-1 text-primary-foreground"
        >
          <Plus size={16} />
          Criar
        </Button>
        <Button
          variant="secondary"
          className="flex items-center gap-1 text-primary-foreground"
        >
          <Users size={16} />
          Entrar
        </Button>
      </nav>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Pesquisar..."
          className="max-w-xs rounded-md border border-input bg-background text-foreground"
        />
        <Button
          variant="secondary"
          className="flex items-center gap-1 text-primary-foreground"
        >
          <LogIn/>
          Logar
        </Button>
      </div>
    </header>
  )
}
