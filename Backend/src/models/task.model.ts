import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model
} from 'sequelize';
import { TaskStatus } from '../domain/entities/task.entity';
import { sequelize } from '../database/connection';
import { ProjectModel } from './project.model';
import { UserModel } from './user.model';

export class TaskModel extends Model<
  InferAttributes<TaskModel>,
  InferCreationAttributes<TaskModel>
> {
  declare id: CreationOptional<number>;
  declare titulo: string;
  declare descripcion: string | null;
  declare estado: CreationOptional<TaskStatus>;
  declare proyectoId: ForeignKey<ProjectModel['id']>;
  declare usuarioId: ForeignKey<UserModel['id']> | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

TaskModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'en_progreso', 'completada'),
      allowNull: false,
      defaultValue: 'pendiente'
    },
    proyectoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'proyectos',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize,
    tableName: 'tareas',
    timestamps: true
  }
);
