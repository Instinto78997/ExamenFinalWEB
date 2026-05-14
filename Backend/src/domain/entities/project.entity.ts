export class Project {
  constructor(
    public readonly id: number,
    public nombre: string,
    public descripcion: string | null,
    public usuarioId: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}
}
