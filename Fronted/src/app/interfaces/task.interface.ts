export type TaskStatus = 'pendiente' | 'en_progreso' | 'completada';

export interface TaskDto {
  id: number;
  titulo: string;
  descripcion: string | null;
  estado: TaskStatus;
  proyectoId: number;
  usuarioId: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskDto {
  titulo: string;
  descripcion?: string | null;
  estado?: TaskStatus;
  usuarioId?: number | null;
}

export interface UpdateTaskDto {
  titulo?: string;
  descripcion?: string | null;
  estado?: TaskStatus;
  usuarioId?: number | null;
}
