"use client"

import { Controller } from "react-hook-form"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import useFormHome from "./_hooks/useFormHome"

export default function HomePage() {
  const { form, onSubmit } = useFormHome()

  return (
    <section className="h-full flex flex-col items-center justify-center from-primary/10 to-background p-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary">Quiz App</h1>
      </div>

      <Card className="w-full max-w-sm p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="pin"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  id={field.name}
                  type="text"
                  inputMode="numeric"
                  placeholder="Insira o PIN"
                  maxLength={6}
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button type="submit" className="w-full" size="lg">
            Entrar no Jogo
          </Button>
        </form>
      </Card>
    </section>
  )
}
