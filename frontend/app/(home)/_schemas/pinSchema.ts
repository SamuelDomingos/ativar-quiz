import z from "zod"

export const pinSchema = z.object({
  pin: z
    .string()
    .min(4, "PIN deve ter pelo menos 4 dígitos")
    .max(6, "PIN não pode exceder 6 dígitos")
    .regex(/^\d+$/, "PIN deve conter apenas números"),
})

export type PinFormData = z.infer<typeof pinSchema>
