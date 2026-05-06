import { UpdateUserDto, UserMe } from "./interfaces/user.interfaces"

export const getMe = async (): Promise<UserMe> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {})

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err?.error ?? "Erro ao buscar dados do usuário")
  }

  return response.json()
}

export const updateUser = async (
  id: string,
  payload: UpdateUserDto
): Promise<UserMe> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  )

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err?.error ?? "Erro ao atualizar usuário")
  }

  return response.json()
}

export const deleteUser = async (id: string): Promise<void> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/${id}`,
    {
      method: "DELETE",
    }
  )

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err?.error ?? "Erro ao remover usuário")
  }
}
