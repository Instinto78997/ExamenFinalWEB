import { Project } from '../entities/project.entity';

export interface CreateProjectData {
  nombre: string;
  descripcion?: string | null;
  usuarioId: number;
}

export interface UpdateProjectData {
  nombre?: string;
  descripcion?: string | null;
}

export interface IProjectRepository {
  create(data: CreateProjectData): Promise<Project>;
  findById(id: number): Promise<Project | null>;
  findByIdAndUser(id: number, usuarioId: number): Promise<Project | null>;
  findAllByUser(usuarioId: number): Promise<Project[]>;
  update(id: number, data: UpdateProjectData): Promise<Project | null>;
  delete(id: number): Promise<boolean>;
}
