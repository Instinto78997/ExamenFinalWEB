import bcrypt from 'bcryptjs';
import { IUserRepository } from '../domain/repository-interfaces/user.repository.interface';
import { AuthResponseDto, LoginDto, RegisterDto } from '../interfaces/auth.dto';
import { signToken } from '../infrastructure/auth/jwt';

export class AuthService {
  constructor(private readonly userRepository: IUserRepository) {}

  async register(data: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('El email ya esta registrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.create({
      nombre: data.nombre,
      email: data.email,
      password: hashedPassword
    });

    return {
      token: signToken({ id: user.id, email: user.email }),
      usuario: {
        id: user.id,
        nombre: user.nombre,
        email: user.email
      }
    };
  }

  async login(data: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Credenciales invalidas');
    }

    const passwordMatches = await bcrypt.compare(data.password, user.password);
    if (!passwordMatches) {
      throw new Error('Credenciales invalidas');
    }

    return {
      token: signToken({ id: user.id, email: user.email }),
      usuario: {
        id: user.id,
        nombre: user.nombre,
        email: user.email
      }
    };
  }
}
