export interface RegisterDto {
  nombre: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  token: string;
  usuario: {
    id: number;
    nombre: string;
    email: string;
  };
}
