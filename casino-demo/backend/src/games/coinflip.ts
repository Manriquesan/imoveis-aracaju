export type CoinSide = 'heads' | 'tails';

export function playCoinFlip(betAmount: number, choice: CoinSide): {
  result: CoinSide;
  win: boolean;
  payout: number;
} {
  const result: CoinSide = Math.random() < 0.5 ? 'heads' : 'tails';
  const win = result === choice;
  const payout = win ? betAmount * 1.9 : 0;
  return { result, win, payout };
}

export function getCoinFlipConfig() {
  return {
    sides: ['heads', 'tails'] as CoinSide[],
    houseEdge: 0.05,
    rtp: 0.95,
  };
}