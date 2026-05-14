import { Task, TaskStatus } from '../entities/task.entity';

export interface CreateTaskData {
  titulo: string;
  descripcion?: string | null;
  estado?: TaskStatus;
  proyectoId: number;
  usuarioId?: number | null;
}

export interface UpdateTaskData {
  titulo?: string;
  descripcion?: string | null;
  estado?: TaskStatus;
  usuarioId?: number | null;
}

export interface ITaskRepository {
  create(data: CreateTaskData): Promise<Task>;
  findById(id: number): Promise<Task | null>;
  findAllByProject(proyectoId: number, estado?: TaskStatus): Promise<Task[]>;
  update(id: number, data: UpdateTaskData): Promise<Task | null>;
  delete(id: number): Promise<boolean>;
}
