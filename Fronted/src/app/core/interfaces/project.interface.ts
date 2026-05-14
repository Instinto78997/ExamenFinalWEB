export interface ProjectDto {
  id: number;
  nombre: string;
  descripcion: string | null;
  usuarioId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProjectDto {
  nombre: string;
  descripcion?: string | null;
}

export interface UpdateProjectDto {
  nombre?: string;
  descripcion?: string | null;
}
