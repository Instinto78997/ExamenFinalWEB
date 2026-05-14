import { Task } from '../../domain/entities/task.entity';
import {
  CreateTaskData,
  ITaskRepository,
  UpdateTaskData
} from '../../domain/repository-interfaces/task.repository.interface';
import { TaskModel } from '../../models';

export class TaskRepository implements ITaskRepository {
  async create(data: CreateTaskData): Promise<Task> {
    const task = await TaskModel.create({
      ...data,
      descripcion: data.descripcion ?? null,
      usuarioId: data.usuarioId ?? null
    });
    return this.toEntity(task);
  }

  async findById(id: number): Promise<Task | null> {
    const task = await TaskModel.findByPk(id);
    return task ? this.toEntity(task) : null;
  }

  async findAllByProject(proyectoId: number, estado?: Task['estado']): Promise<Task[]> {
    const tasks = await TaskModel.findAll({
      where: estado ? { proyectoId, estado } : { proyectoId },
      order: [['createdAt', 'DESC']]
    });
    return tasks.map((task) => this.toEntity(task));
  }

  async update(id: number, data: UpdateTaskData): Promise<Task | null> {
    const task = await TaskModel.findByPk(id);
    if (!task) return null;

    await task.update(data);
    return this.toEntity(task);
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await TaskModel.destroy({ where: { id } });
    return deleted > 0;
  }

  private toEntity(task: TaskModel): Task {
    return new Task(
      task.id,
      task.titulo,
      task.descripcion,
      task.estado,
      task.proyectoId,
      task.usuarioId,
      task.createdAt,
      task.updatedAt
    );
  }
}
