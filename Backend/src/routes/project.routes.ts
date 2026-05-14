import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { authMiddleware } from '../infrastructure/auth/auth.middleware';
import { ProjectRepository } from '../infrastructure/repositories/project.repository';
import { ProjectService } from '../services/project.service';

const router = Router();
const projectRepository = new ProjectRepository();
const projectService = new ProjectService(projectRepository);
const projectController = new ProjectController(projectService);

router.use(authMiddleware);

router.get('/', projectController.getAll);
router.post('/', projectController.create);
router.get('/:id', projectController.getById);
router.put('/:id', projectController.update);
router.delete('/:id', projectController.delete);

export default router;
