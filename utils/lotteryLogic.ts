import { LotteryDraw, Statistics, TOTAL_RED_BALLS, TOTAL_BLUE_BALLS, StrategyType } from '../types';

export const calculateStatistics = (data: LotteryDraw[]): Statistics => {
  const stats: Statistics = {
    totalDraws: data.length,
    redFrequency: {},
    blueFrequency: {},
    hotRed: [],
    coldRed: [],
    hotBlue: [],
    coldBlue: [],
    oddEvenRed: { odd: 0, even: 0 },
    oddEvenBlue: { odd: 0, even: 0 },
  };

  // Initialize frequencies
  for (let i = 1; i <= TOTAL_RED_BALLS; i++) stats.redFrequency[i] = 0;
  for (let i = 1; i <= TOTAL_BLUE_BALLS; i++) stats.blueFrequency[i] = 0;

  data.forEach((draw) => {
    draw.redBalls.forEach((num) => {
      stats.redFrequency[num]++;
      if (num % 2 !== 0) stats.oddEvenRed.odd++;
      else stats.oddEvenRed.even++;
    });
    draw.blueBalls.forEach((num) => {
      stats.blueFrequency[num]++;
      if (num % 2 !== 0) stats.oddEvenBlue.odd++;
      else stats.oddEvenBlue.even++;
    });
  });

  // Calculate Hot/Cold
  stats.hotRed = Object.entries(stats.redFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([k]) => parseInt(k));

  stats.coldRed = Object.entries(stats.redFrequency)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 10)
    .map(([k]) => parseInt(k));

  stats.hotBlue = Object.entries(stats.blueFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([k]) => parseInt(k));

  stats.coldBlue = Object.entries(stats.blueFrequency)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 5)
    .map(([k]) => parseInt(k));

  return stats;
};

// Combinatorics for Rotation Matrix
export const combinations = (arr: number[], k: number): number[][] => {
  const result: number[][] = [];
  
  function backtrack(start: number, combo: number[]) {
    if (combo.length === k) {
      result.push([...combo]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      combo.push(arr[i]);
      backtrack(i + 1, combo);
      combo.pop();
    }
  }
  
  backtrack(0, []);
  return result;
};

export const generateMatrix = (selectedRed: number[], selectedBlue: number[]) => {
  // If user selects less than required, return empty
  if (selectedRed.length < 5 || selectedBlue.length < 2) return [];

  const redCombos = combinations(selectedRed, 5);
  const blueCombos = combinations(selectedBlue, 2);

  const finalMatrix: { red: number[]; blue: number[] }[] = [];

  // Generate full cartesian product (Caution: can be huge)
  // Limiting to first 2000 combinations for performance demo
  let count = 0;
  for (const r of redCombos) {
    for (const b of blueCombos) {
      if (count >= 2000) break; // Safety break
      finalMatrix.push({ red: r, blue: b });
      count++;
    }
    if (count >= 2000) break;
  }

  return finalMatrix;
};

// --- Smart Pick Logic ---

// Helper: Pick N random unique elements from a pool array
const pickRandom = (pool: number[], n: number): number[] => {
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n).sort((a, b) => a - b);
};

export const generateSmartPicks = (
  stats: Statistics,
  count: number,
  strategy: StrategyType
): { red: number[]; blue: number[] }[] => {
  const results: { red: number[]; blue: number[] }[] = [];
  const allReds = Array.from({ length: TOTAL_RED_BALLS }, (_, i) => i + 1);
  const allBlues = Array.from({ length: TOTAL_BLUE_BALLS }, (_, i) => i + 1);

  // Prepare pools based on stats for Hot/Cold strategies
  // Sort all numbers by frequency
  const sortedRedsByFreq = [...allReds].sort((a, b) => (stats.redFrequency[b] || 0) - (stats.redFrequency[a] || 0));
  const sortedBluesByFreq = [...allBlues].sort((a, b) => (stats.blueFrequency[b] || 0) - (stats.blueFrequency[a] || 0));

  const hotRedPool = sortedRedsByFreq.slice(0, 15); // Top 15 hottest
  const hotBluePool = sortedBluesByFreq.slice(0, 6); // Top 6 hottest

  const coldRedPool = sortedRedsByFreq.slice(-15); // Top 15 coldest
  const coldBluePool = sortedBluesByFreq.slice(-6); // Top 6 coldest

  for (let i = 0; i < count; i++) {
    let red: number[] = [];
    let blue: number[] = [];

    switch (strategy) {
      case 'hot':
        // Pick 3-4 from hot pool, rest from random
        const hotRedCount = Math.random() > 0.5 ? 4 : 3;
        const hotReds = pickRandom(hotRedPool, hotRedCount);
        const remainingRedPool = allReds.filter(n => !hotReds.includes(n));
        const restReds = pickRandom(remainingRedPool, 5 - hotRedCount);
        red = [...hotReds, ...restReds].sort((a, b) => a - b);

        // Pick 1-2 from hot blue pool
        const hotBlueCount = Math.random() > 0.8 ? 2 : 1;
        const hotBlues = pickRandom(hotBluePool, hotBlueCount);
        const remainingBluePool = allBlues.filter(n => !hotBlues.includes(n));
        const restBlues = pickRandom(remainingBluePool, 2 - hotBlueCount);
        blue = [...hotBlues, ...restBlues].sort((a, b) => a - b);
        break;

      case 'cold':
        // Pick 3-4 from cold pool, rest from random
        const coldRedCount = Math.random() > 0.5 ? 4 : 3;
        const coldReds = pickRandom(coldRedPool, coldRedCount);
        const remainingColdRedPool = allReds.filter(n => !coldReds.includes(n));
        const restColdReds = pickRandom(remainingColdRedPool, 5 - coldRedCount);
        red = [...coldReds, ...restColdReds].sort((a, b) => a - b);

        // Pick 1-2 from cold blue pool
        const coldBlueCount = Math.random() > 0.8 ? 2 : 1;
        const coldBlues = pickRandom(coldBluePool, coldBlueCount);
        const remainingColdBluePool = allBlues.filter(n => !coldBlues.includes(n));
        const restColdBlues = pickRandom(remainingColdBluePool, 2 - coldBlueCount);
        blue = [...coldBlues, ...restColdBlues].sort((a, b) => a - b);
        break;

      case 'balanced':
        // Attempt to find a balanced combination
        // Balance Criteria: Odd/Even ratio approx 2:3 or 3:2 AND Small/Big (1-18, 19-35) approx 2:3 or 3:2
        let attempts = 0;
        let valid = false;
        while (!valid && attempts < 100) {
          const candidateRed = pickRandom(allReds, 5);
          const oddCount = candidateRed.filter(n => n % 2 !== 0).length;
          const bigCount = candidateRed.filter(n => n > 18).length;

          if ((oddCount === 2 || oddCount === 3) && (bigCount === 2 || bigCount === 3)) {
            red = candidateRed;
            valid = true;
          }
          attempts++;
        }
        if (!valid) red = pickRandom(allReds, 5); // Fallback

        // Blue balance: 1 odd 1 even or just random
        blue = pickRandom(allBlues, 2);
        break;

      case 'random':
      default:
        red = pickRandom(allReds, 5);
        blue = pickRandom(allBlues, 2);
        break;
    }

    results.push({ red, blue });
  }

  return results;
};