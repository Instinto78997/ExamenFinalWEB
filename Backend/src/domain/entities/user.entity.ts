export class User {
  constructor(
    public readonly id: number,
    public nombre: string,
    public email: string,
    public password: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}
}
