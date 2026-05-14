import { Project } from '../../domain/entities/project.entity';
import {
  CreateProjectData,
  IProjectRepository,
  UpdateProjectData
} from '../../domain/repository-interfaces/project.repository.interface';
import { ProjectModel } from '../../models';

export class ProjectRepository implements IProjectRepository {
  async create(data: CreateProjectData): Promise<Project> {
    const project = await ProjectModel.create({
      ...data,
      descripcion: data.descripcion ?? null
    });
    return this.toEntity(project);
  }

  async findById(id: number): Promise<Project | null> {
    const project = await ProjectModel.findByPk(id);
    return project ? this.toEntity(project) : null;
  }

  async findByIdAndUser(id: number, usuarioId: number): Promise<Project | null> {
    const project = await ProjectModel.findOne({ where: { id, usuarioId } });
    return project ? this.toEntity(project) : null;
  }

  async findAllByUser(usuarioId: number): Promise<Project[]> {
    const projects = await ProjectModel.findAll({
      where: { usuarioId },
      order: [['createdAt', 'DESC']]
    });
    return projects.map((project) => this.toEntity(project));
  }

  async update(id: number, data: UpdateProjectData): Promise<Project | null> {
    const project = await ProjectModel.findByPk(id);
    if (!project) return null;

    await project.update(data);
    return this.toEntity(project);
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await ProjectModel.destroy({ where: { id } });
    return deleted > 0;
  }

  private toEntity(project: ProjectModel): Project {
    return new Project(
      project.id,
      project.nombre,
      project.descripcion,
      project.usuarioId,
      project.createdAt,
      project.updatedAt
    );
  }
}
