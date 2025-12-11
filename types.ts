export interface LotteryDraw {
  id: string; // 期号
  date: string; // 日期
  redBalls: number[]; // 前区 (5个)
  blueBalls: number[]; // 后区 (2个)
}

export interface Statistics {
  totalDraws: number;
  redFrequency: Record<number, number>;
  blueFrequency: Record<number, number>;
  hotRed: number[];
  coldRed: number[];
  hotBlue: number[];
  coldBlue: number[];
  oddEvenRed: { odd: number; even: number };
  oddEvenBlue: { odd: number; even: number };
}

export type TabType = 'dashboard' | 'matrix' | 'history' | 'import' | 'pick';

export type StrategyType = 'random' | 'hot' | 'cold' | 'balanced';

export const TOTAL_RED_BALLS = 35;
export const TOTAL_BLUE_BALLS = 12;