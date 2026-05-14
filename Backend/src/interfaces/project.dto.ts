export interface CreateProjectDto {
  nombre: string;
  descripcion?: string | null;
}

export interface UpdateProjectDto {
  nombre?: string;
  descripcion?: string | null;
}
