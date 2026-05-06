import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PinFormData, pinSchema } from "../_schemas/pinSchema"
import { toast } from "sonner"
import { joinGame } from "@/lib/api/game"

const useFormHome = () => {
  const router = useRouter()
  const form = useForm<PinFormData>({
    resolver: zodResolver(pinSchema),
    defaultValues: {
      pin: "",
    },
  })

  const onSubmit = async (data: PinFormData) => {
    try {
      form.getFieldState("pin")

      await joinGame(data.pin)

      toast.success("Você entrou no jogo com sucesso")

      router.push(`/play/quiz/${data.pin}`)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao entrar no jogo"

      toast.error(errorMessage)

      console.error("Erro ao entrar no jogo:", error)
    }
  }

  return {
    form,
    onSubmit,
  }
}

export default useFormHome
