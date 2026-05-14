import { IProjectRepository } from '../domain/repository-interfaces/project.repository.interface';
import { CreateProjectDto, UpdateProjectDto } from '../interfaces/project.dto';

export class ProjectService {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async getUserProjects(usuarioId: number) {
    return this.projectRepository.findAllByUser(usuarioId);
  }

  async getProjectById(id: number, usuarioId: number) {
    const project = await this.projectRepository.findByIdAndUser(id, usuarioId);
    if (!project) {
      throw new Error('Proyecto no encontrado');
    }

    return project;
  }

  async createProject(data: CreateProjectDto, usuarioId: number) {
    return this.projectRepository.create({
      nombre: data.nombre,
      descripcion: data.descripcion ?? null,
      usuarioId
    });
  }

  async updateProject(id: number, usuarioId: number, data: UpdateProjectDto) {
    await this.getProjectById(id, usuarioId);
    return this.projectRepository.update(id, data);
  }

  async deleteProject(id: number, usuarioId: number) {
    await this.getProjectById(id, usuarioId);
    return this.projectRepository.delete(id);
  }
}
