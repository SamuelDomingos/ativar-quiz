import { AuthDto, LoginResponse } from "./interfaces/auth.interfaces"

export const register = async (data: AuthDto): Promise<LoginResponse> => {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    // Propaga o erro do backend.
    throw new Error(error?.error ?? "Erro ao registrar usuário")
  }

  return response.json() as Promise<LoginResponse>
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error?.error ?? "Credenciais inválidas")
  }

  return response.json() as Promise<LoginResponse>
}
