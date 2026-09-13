import { Router, Request, Response } from 'express';
import { authMiddleware, JWTPayload } from '../middleware/auth.js';
import { getUserById, updateBalance, getTransactions, createTransaction } from '../db/database.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.get('/balance', authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user as JWTPayload;
  const dbUser = getUserById(user.userId);
  if (!dbUser) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json({ balance: (dbUser as any).balance });
});

router.get('/transactions', authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user as JWTPayload;
  const transactions = getTransactions(user.userId);
  res.json({ transactions });
});

router.post('/deposit', authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user as JWTPayload;
  const { amount } = req.body;
  if (!amount || amount <= 0 || amount > 100000) {
    return res.status(400).json({ error: 'Valor inválido (1-100.000)' });
  }
  const dbUser = getUserById(user.userId) as any;
  const newBalance = dbUser.balance + amount;
  updateBalance(user.userId, newBalance);
  createTransaction(uuidv4(), user.userId, 'deposit', amount, newBalance, { demo: true });
  res.json({ balance: newBalance, transaction: { type: 'deposit', amount } });
});

export default router;