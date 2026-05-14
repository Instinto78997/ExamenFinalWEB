import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { nombre, email, password } = req.body;
      if (!nombre || !email || !password) {
        res.status(400).json({ message: 'nombre, email y password son obligatorios' });
        return;
      }

      const response = await this.authService.register({ nombre, email, password });
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ message: this.getErrorMessage(error) });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: 'email y password son obligatorios' });
        return;
      }

      const response = await this.authService.login({ email, password });
      res.json(response);
    } catch (error) {
      res.status(401).json({ message: this.getErrorMessage(error) });
    }
  };

  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Error inesperado';
  }
}
