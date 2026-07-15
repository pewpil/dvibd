import { Router } from 'express';
import type { Request, Response } from 'express';
import type { User } from '../generated/prisma/client.ts';
import { prisma } from '../lib/prisma.js';
import { hashPassword, verifyPassword, signToken } from '../lib/auth.js';
import { requireAuth } from '../middleware/auth.js';

export const authRouter: Router = Router();

interface PublicUser {
  id: string;
  email: string;
  username: string;
}

interface SignupBody {
  username?: string;
  email?: string;
  password?: string;
}

interface LoginBody {
  email?: string;
  password?: string;
}

function toPublic(user: User): PublicUser {
  return { id: user.id, email: user.email, username: user.username };
}

authRouter.post('/signup', async (req: Request, res: Response): Promise<void> => {
  const { username, email, password }: SignupBody = req.body ?? {};
  if (!username || !email || !password) {
    res.status(400).json({ message: 'username, email and password are required' });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ message: 'Password must be at least 8 characters' });
    return;
  }

  const taken: User | null = await prisma.user.findFirst({
    where: { OR: [{ email: email }, { username: username }] },
  });
  if (taken) {
    res.status(409).json({ message: 'Email or username already taken' });
    return;
  }

  const passwordHash: string = await hashPassword(password);
  const user: User = await prisma.user.create({
    data: { username, email, passwordHash },
  });
  const token: string = signToken(user.id);
  res.status(201).json({ token, user: toPublic(user) });
});

authRouter.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password }: LoginBody = req.body ?? {};
  if (!email || !password) {
    res.status(400).json({ message: 'email and password are required' });
    return;
  }

  const user: User | null = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const ok: boolean = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const token: string = signToken(user.id);
  res.json({ token, user: toPublic(user) });
});

authRouter.get('/me', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const userId: string | undefined = req.userId;
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const user: User | null = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    res.status(404).json({ message: 'Not found' });
    return;
  }
  res.json({ user: toPublic(user) });
});
