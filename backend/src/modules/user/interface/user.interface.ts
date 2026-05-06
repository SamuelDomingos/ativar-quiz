export interface User {
  id: string;
  name: string | null;
  email: string | null;
  password: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}
