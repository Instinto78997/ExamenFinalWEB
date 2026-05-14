import { Response } from 'express';
import { AuthenticatedRequest } from '../infrastructure/auth/auth.middleware';
import { ProjectService } from '../services/project.service';

export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  getAll = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const projects = await this.projectService.getUserProjects(req.user!.id);
    res.json(projects);
  };

  create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { nombre, descripcion } = req.body;
      if (!nombre) {
        res.status(400).json({ message: 'nombre es obligatorio' });
        return;
      }

      const project = await this.projectService.createProject(
        { nombre, descripcion },
        req.user!.id
      );
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ message: this.getErrorMessage(error) });
    }
  };

  getById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const project = await this.projectService.getProjectById(
        Number(req.params.id),
        req.user!.id
      );
      res.json(project);
    } catch (error) {
      res.status(404).json({ message: this.getErrorMessage(error) });
    }
  };

  update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const project = await this.projectService.updateProject(
        Number(req.params.id),
        req.user!.id,
        req.body
      );
      res.json(project);
    } catch (error) {
      res.status(404).json({ message: this.getErrorMessage(error) });
    }
  };

  delete = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      await this.projectService.deleteProject(Number(req.params.id), req.user!.id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: this.getErrorMessage(error) });
    }
  };

  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Error inesperado';
  }
}
