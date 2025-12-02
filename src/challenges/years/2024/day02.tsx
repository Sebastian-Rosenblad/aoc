import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day02.data.ts';

export const meta: Meta = { year: 2024, day: 2, status: 'gold' };

export default function Day02() {
  function parse(input: string) {
    const lines = input.split('\n');
    return lines.map(line => line.trim().split(' ').map(Number));
  }

  function one(input: string): string {
    return solve(parse(input), 'one').toString();
  }

  function two(input: string): string {
    return solve(parse(input), 'two').toString();
  }

  function solve(data: number[][], part: 'one' | 'two') {
    let numOfSafe = 0;
    for (let i = 0; i < data.length; i++) {
      const max = part === 'one' ? 0 : data[i].length;
      for (let r = -1; r < max; r++) {
        let heights = [...data[i]];
        if (r >= 0) heights.splice(r, 1);
        let safe = true;
        const firstMove = heights[1] - heights[0];
        if (!isSafe(firstMove)) continue;
        for (let j = 2; j < heights.length; j++) {
          if (!isSafe(heights[j] - heights[j - 1], firstMove)) {
            safe = false;
            break;
          }
        }
        if (safe) {
          numOfSafe += 1;
          break;
        }
      }
    }
    return numOfSafe;
  }

  function isSafe(move: number, firstMove?: number) {
    if (move === 0) return false;
    if (Math.abs(move) > 3) return false;
    if (firstMove !== undefined) {
      if (firstMove > 0 && move < 0) return false;
      if (firstMove < 0 && move > 0) return false;
    }
    return true;
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
