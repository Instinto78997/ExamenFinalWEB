import { Response } from 'express';
import { TaskStatus } from '../domain/entities/task.entity';
import { AuthenticatedRequest } from '../infrastructure/auth/auth.middleware';
import { TaskService } from '../services/task.service';

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  getByProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const tasks = await this.taskService.getProjectTasks(
        Number(req.params.proyectoId),
        req.user!.id,
        req.query.estado as TaskStatus | undefined
      );
      res.json(tasks);
    } catch (error) {
      this.sendError(res, error);
    }
  };

  create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { titulo } = req.body;
      if (!titulo) {
        res.status(400).json({ message: 'titulo es obligatorio' });
        return;
      }

      const task = await this.taskService.createTask(
        Number(req.params.proyectoId),
        req.user!.id,
        req.body
      );
      res.status(201).json(task);
    } catch (error) {
      this.sendError(res, error);
    }
  };

  getById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const task = await this.taskService.getTaskById(Number(req.params.id), req.user!.id);
      res.json(task);
    } catch (error) {
      this.sendError(res, error);
    }
  };

  update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const task = await this.taskService.updateTask(
        Number(req.params.id),
        req.user!.id,
        req.body
      );
      res.json(task);
    } catch (error) {
      this.sendError(res, error);
    }
  };

  delete = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      await this.taskService.deleteTask(Number(req.params.id), req.user!.id);
      res.status(204).send();
    } catch (error) {
      this.sendError(res, error);
    }
  };

  private sendError(res: Response, error: unknown): void {
    const message = error instanceof Error ? error.message : 'Error inesperado';
    const status = message.includes('no encontrado') ? 404 : 400;
    res.status(status).json({ message });
  }
}
