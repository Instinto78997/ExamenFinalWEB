export type TaskStatus = 'pendiente' | 'en_progreso' | 'completada';

export class Task {
  constructor(
    public readonly id: number,
    public titulo: string,
    public descripcion: string | null,
    public estado: TaskStatus,
    public proyectoId: number,
    public usuarioId: number | null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}
}
