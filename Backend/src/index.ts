import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { sequelize } from './database/connection';
import './models';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import taskRoutes from './routes/task.routes';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);
const localDevOrigin = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;
const allowedOrigins = (process.env.FRONTEND_ORIGINS || 'http://localhost:4200')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || localDevOrigin.test(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origen no permitido por CORS: ${origin}`));
    }
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/proyectos', projectRoutes);
app.use('/api', taskRoutes);

async function startServer(): Promise<void> {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    app.listen(port, () => {
      console.log(`API escuchando en http://localhost:${port}/api`);
    });
  } catch (error) {
    console.error('No se pudo iniciar el servidor', error);
    process.exit(1);
  }
}

startServer();
