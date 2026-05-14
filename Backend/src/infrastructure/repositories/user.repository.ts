import { User } from '../../domain/entities/user.entity';
import {
  CreateUserData,
  IUserRepository
} from '../../domain/repository-interfaces/user.repository.interface';
import { UserModel } from '../../models';

export class UserRepository implements IUserRepository {
  async create(data: CreateUserData): Promise<User> {
    const user = await UserModel.create(data);
    return this.toEntity(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ where: { email } });
    return user ? this.toEntity(user) : null;
  }

  async findById(id: number): Promise<User | null> {
    const user = await UserModel.findByPk(id);
    return user ? this.toEntity(user) : null;
  }

  private toEntity(user: UserModel): User {
    return new User(
      user.id,
      user.nombre,
      user.email,
      user.password,
      user.createdAt,
      user.updatedAt
    );
  }
}
