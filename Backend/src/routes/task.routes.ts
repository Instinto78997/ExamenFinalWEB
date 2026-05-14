import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authMiddleware } from '../infrastructure/auth/auth.middleware';
import { ProjectRepository } from '../infrastructure/repositories/project.repository';
import { TaskRepository } from '../infrastructure/repositories/task.repository';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { TaskService } from '../services/task.service';

const router = Router();
const taskRepository = new TaskRepository();
const projectRepository = new ProjectRepository();
const userRepository = new UserRepository();
const taskService = new TaskService(taskRepository, projectRepository, userRepository);
const taskController = new TaskController(taskService);

router.use(authMiddleware);

router.get('/proyectos/:proyectoId/tareas', taskController.getByProject);
router.post('/proyectos/:proyectoId/tareas', taskController.create);
router.get('/tareas/:id', taskController.getById);
router.put('/tareas/:id', taskController.update);
router.delete('/tareas/:id', taskController.delete);

export default router;
