export interface RegisterDto {
  nombre: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  nombre: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  usuario: AuthUser;
}
