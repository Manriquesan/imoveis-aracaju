import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const db = new Database(join(__dirname, '../../casino.db'));

db.pragma('journal_mode = WAL');

export function getUserById(id: string) {
  return db.prepare('SELECT id, email, balance, created_at FROM users WHERE id = ?').get(id);
}

export function getUserByEmail(email: string) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
}

export function createUser(id: string, email: string, passwordHash: string, balance = 10000) {
  return db.prepare('INSERT INTO users (id, email, password_hash, balance) VALUES (?, ?, ?, ?)')
    .run(id, email, passwordHash, balance);
}

export function updateBalance(userId: string, newBalance: number) {
  return db.prepare('UPDATE users SET balance = ? WHERE id = ?').run(newBalance, userId);
}

export function createTransaction(
  id: string,
  userId: string,
  type: string,
  amount: number,
  balanceAfter: number,
  metadata?: object
) {
  return db.prepare(
    'INSERT INTO transactions (id, user_id, type, amount, balance_after, metadata) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(id, userId, type, amount, balanceAfter, metadata ? JSON.stringify(metadata) : null);
}

export function getTransactions(userId: string, limit = 50) {
  return db.prepare(
    'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ?'
  ).all(userId, limit);
}

export function createGameSession(
  id: string,
  userId: string,
  gameType: string,
  betAmount: number,
  winAmount: number,
  result: object
) {
  return db.prepare(
    'INSERT INTO game_sessions (id, user_id, game_type, bet_amount, win_amount, result) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(id, userId, gameType, betAmount, winAmount, JSON.stringify(result));
}

export function getGameSessions(userId: string, limit = 20) {
  return db.prepare(
    'SELECT * FROM game_sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT ?'
  ).all(userId, limit);
}