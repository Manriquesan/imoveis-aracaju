const SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎', '7️⃣'];
const WEIGHTS = [30, 25, 20, 15, 6, 3, 1];
const PAYTABLE: Record<string, number> = {
  '🍒': 2,
  '🍋': 3,
  '🍊': 4,
  '🍇': 5,
  '⭐': 10,
  '💎': 25,
  '7️⃣': 100,
};

function weightedRandom(): string {
  const total = WEIGHTS.reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  for (let i = 0; i < SYMBOLS.length; i++) {
    rand -= WEIGHTS[i];
    if (rand <= 0) return SYMBOLS[i];
  }
  return SYMBOLS[0];
}

function spinReel(): string[] {
  return [weightedRandom(), weightedRandom(), weightedRandom()];
}

export function playSlot(betAmount: number, lines: number): {
  reels: string[][];
  wins: { line: number; symbol: string; count: number; payout: number }[];
  totalWin: number;
} {
  const reels: string[][] = [];
  for (let i = 0; i < 3; i++) {
    reels.push(spinReel());
  }

  const wins: { line: number; symbol: string; count: number; payout: number }[] = [];
  let totalWin = 0;

  for (let line = 0; line < Math.min(lines, 3); line++) {
    const symbols = [reels[0][line], reels[1][line], reels[2][line]];
    const first = symbols[0];
    let count = 1;
    for (let i = 1; i < 3; i++) {
      if (symbols[i] === first) count++;
      else break;
    }
    if (count >= 2) {
      const multiplier = PAYTABLE[first] || 0;
      const payout = betAmount * multiplier * (count === 3 ? 2 : 1);
      wins.push({ line: line + 1, symbol: first, count, payout });
      totalWin += payout;
    }
  }

  return { reels, wins, totalWin };
}

export function getSlotConfig() {
  return { symbols: SYMBOLS, paytable: PAYTABLE };
}