export interface AuthDto {
  email: string;
  password: string;
  name?: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export interface RegisterDto extends AuthDto {
  name: string;
}

export interface AuthUser {
  id: string;
  name: string | null;
  email: string;
}