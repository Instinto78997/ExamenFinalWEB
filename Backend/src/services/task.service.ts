import { TaskStatus } from '../domain/entities/task.entity';
import { IProjectRepository } from '../domain/repository-interfaces/project.repository.interface';
import { ITaskRepository } from '../domain/repository-interfaces/task.repository.interface';
import { IUserRepository } from '../domain/repository-interfaces/user.repository.interface';
import { CreateTaskDto, UpdateTaskDto } from '../interfaces/task.dto';

const validStatuses: TaskStatus[] = ['pendiente', 'en_progreso', 'completada'];

export class TaskService {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly projectRepository: IProjectRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async getProjectTasks(proyectoId: number, usuarioId: number, estado?: TaskStatus) {
    await this.ensureProjectBelongsToUser(proyectoId, usuarioId);

    if (estado && !validStatuses.includes(estado)) {
      throw new Error('Estado invalido');
    }

    return this.taskRepository.findAllByProject(proyectoId, estado);
  }

  async getTaskById(id: number, usuarioId: number) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error('Tarea no encontrada');
    }

    await this.ensureProjectBelongsToUser(task.proyectoId, usuarioId);
    return task;
  }

  async createTask(proyectoId: number, usuarioId: number, data: CreateTaskDto) {
    await this.ensureProjectBelongsToUser(proyectoId, usuarioId);
    await this.ensureResponsibleExists(data.usuarioId);

    if (data.estado && !validStatuses.includes(data.estado)) {
      throw new Error('Estado invalido');
    }

    return this.taskRepository.create({
      titulo: data.titulo,
      descripcion: data.descripcion ?? null,
      estado: data.estado ?? 'pendiente',
      proyectoId,
      usuarioId: data.usuarioId ?? null
    });
  }

  async updateTask(id: number, usuarioId: number, data: UpdateTaskDto) {
    const task = await this.getTaskById(id, usuarioId);
    await this.ensureResponsibleExists(data.usuarioId);

    if (data.estado && !validStatuses.includes(data.estado)) {
      throw new Error('Estado invalido');
    }

    return this.taskRepository.update(task.id, data);
  }

  async deleteTask(id: number, usuarioId: number) {
    const task = await this.getTaskById(id, usuarioId);
    return this.taskRepository.delete(task.id);
  }

  private async ensureProjectBelongsToUser(proyectoId: number, usuarioId: number) {
    const project = await this.projectRepository.findByIdAndUser(proyectoId, usuarioId);
    if (!project) {
      throw new Error('Proyecto no encontrado');
    }
  }

  private async ensureResponsibleExists(usuarioId?: number | null) {
    if (!usuarioId) return;

    const user = await this.userRepository.findById(usuarioId);
    if (!user) {
      throw new Error('Responsable no encontrado');
    }
  }
}
