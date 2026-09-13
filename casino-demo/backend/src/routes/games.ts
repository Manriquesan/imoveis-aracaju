import { Router, Request, Response } from 'express';
import { authMiddleware, JWTPayload } from '../middleware/auth.js';
import { betSchema, slotBetSchema } from '../utils/validation.js';
import { getUserById, updateBalance, createTransaction, createGameSession } from '../db/database.js';
import { playSlot, getSlotConfig } from '../games/slot.js';
import { playCoinFlip, getCoinFlipConfig } from '../games/coinflip.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.get('/slot/config', (_req: Request, res: Response) => {
  res.json(getSlotConfig());
});

router.post('/slot/spin', authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user as JWTPayload;
  const parse = slotBetSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.errors[0].message });
  }
  const { amount, lines } = parse.data;
  const dbUser = getUserById(user.userId) as any;
  if (!dbUser) return res.status(404).json({ error: 'Usuário não encontrado' });
  const totalBet = amount * lines;
  if (dbUser.balance < totalBet) {
    return res.status(400).json({ error: 'Saldo insuficiente' });
  }
  const newBalance = dbUser.balance - totalBet;
  updateBalance(user.userId, newBalance);
  createTransaction(uuidv4(), user.userId, 'bet', -totalBet, newBalance, { game: 'slot', lines });
  const result = playSlot(amount, lines);
  const finalBalance = newBalance + result.totalWin;
  updateBalance(user.userId, finalBalance);
  if (result.totalWin > 0) {
    createTransaction(uuidv4(), user.userId, 'win', result.totalWin, finalBalance, { game: 'slot', lines });
  }
  createGameSession(uuidv4(), user.userId, 'slot', totalBet, result.totalWin, result);
  res.json({ ...result, balance: finalBalance, bet: totalBet });
});

router.get('/coinflip/config', (_req: Request, res: Response) => {
  res.json(getCoinFlipConfig());
});

router.post('/coinflip/play', authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user as JWTPayload;
  const parse = betSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.errors[0].message });
  }
  const { amount } = parse.data;
  const { choice } = req.body;
  if (!['heads', 'tails'].includes(choice)) {
    return res.status(400).json({ error: 'Escolha heads ou tails' });
  }
  const dbUser = getUserById(user.userId) as any;
  if (!dbUser) return res.status(404).json({ error: 'Usuário não encontrado' });
  if (dbUser.balance < amount) {
    return res.status(400).json({ error: 'Saldo insuficiente' });
  }
  const newBalance = dbUser.balance - amount;
  updateBalance(user.userId, newBalance);
  createTransaction(uuidv4(), user.userId, 'bet', -amount, newBalance, { game: 'coinflip', choice });
  const result = playCoinFlip(amount, choice);
  const finalBalance = newBalance + result.payout;
  updateBalance(user.userId, finalBalance);
  if (result.payout > 0) {
    createTransaction(uuidv4(), user.userId, 'win', result.payout, finalBalance, { game: 'coinflip', choice });
  }
  createGameSession(uuidv4(), user.userId, 'coinflip', amount, result.payout, result);
  res.json({ ...result, balance: finalBalance, bet: amount });
});

router.get('/history', authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user as JWTPayload;
  const sessions = getGameSessions(user.userId);
  res.json({ sessions });
});

function getGameSessions(userId: string) {
  const db = require('../db/database.js').db;
  return db.prepare('SELECT * FROM game_sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 20').all(userId);
}

export default router;