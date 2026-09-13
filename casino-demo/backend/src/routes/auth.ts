import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { registerSchema, loginSchema } from '../utils/validation.js';
import { getUserByEmail, createUser } from '../db/database.js';
import { generateToken, authMiddleware, JWTPayload } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.errors[0].message });
  }
  const { email, password } = parse.data;
  const existing = getUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'Email já cadastrado' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const id = uuidv4();
  createUser(id, email, passwordHash);
  const token = generateToken({ userId: id, email });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ user: { id, email, balance: 10000 } });
});

router.post('/login', async (req: Request, res: Response) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.errors[0].message });
  }
  const { email, password } = parse.data;
  const user = getUserByEmail(email) as any;
  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
  const token = generateToken({ userId: user.id, email: user.email });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ user: { id: user.id, email: user.email, balance: user.balance } });
});

router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ success: true });
});

router.get('/me', authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user as JWTPayload;
  res.json({ user });
});

export default router;