import { TaskStatus } from '../domain/entities/task.entity';

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
