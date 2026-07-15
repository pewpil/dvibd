import 'dotenv/config';
import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.js';

const app: Express = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:3000' }));
app.use(express.json());

app.get('/health', (_req: Request, res: Response): void => {
  res.json({ ok: true });
});

app.use('/api/auth', authRouter);

const PORT: number = Number(process.env.PORT ?? 4000);
app.listen(PORT, (): void => {
  console.log(`dvibd api listening on :${PORT}`);
});
