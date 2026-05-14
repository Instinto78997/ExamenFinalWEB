import { ProjectModel } from './project.model';
import { TaskModel } from './task.model';
import { UserModel } from './user.model';

UserModel.hasMany(ProjectModel, {
  foreignKey: 'usuarioId',
  as: 'proyectos'
});
ProjectModel.belongsTo(UserModel, {
  foreignKey: 'usuarioId',
  as: 'usuario'
});

ProjectModel.hasMany(TaskModel, {
  foreignKey: 'proyectoId',
  as: 'tareas',
  onDelete: 'CASCADE'
});
TaskModel.belongsTo(ProjectModel, {
  foreignKey: 'proyectoId',
  as: 'proyecto'
});

UserModel.hasMany(TaskModel, {
  foreignKey: 'usuarioId',
  as: 'tareas'
});
TaskModel.belongsTo(UserModel, {
  foreignKey: 'usuarioId',
  as: 'responsable'
});

export { ProjectModel, TaskModel, UserModel };
