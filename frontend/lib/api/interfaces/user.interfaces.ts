export interface UserMe {
  id: string
  name: string | null
  email: string | null
  avatar: string | null
  createdAt: string
  updatedAt: string | null
}

export interface UpdateUserDto {
  name?: string
  email?: string
}

export interface UserProfile {
  id: string
  name: string | null
  email: string | null
  avatar: string | null
  createdAt: string
  updatedAt: string | null
}
