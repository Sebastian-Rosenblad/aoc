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
    const data = parse(input);
    let solution = 0;
    for (let i = 0; i < data.length; i++) {
      let safe = true;
      const dir = data[i][1] - data[i][0];
      if (dir === 0 || Math.abs(dir) > 3) continue;
      for (let j = 2; j < data[i].length; j++) {
        if (!isSafe(dir, data[i][j] - data[i][j - 1])) {
          safe = false;
          break;
        }
      }
      if (safe) solution += 1;
    }
    return solution.toString();
  }

  function isSafe(d: number, m: number) {
    if (m === 0) return false;
    if (d > 0 && m < 0) return false;
    if (d < 0 && m > 0) return false;
    if (Math.abs(m) > 3) return false;
    return true;
  }

  function two(input: string): string {
    // not: 256, >307
    const data = parse(input);
    let solution = 0;
    for (let i = 0; i < data.length; i++) {
      for (let r = -1; r < data[i].length; r++) {
        let td = [...data[i]];
        if (r >= 0) td.splice(r, 1);
        let safe = true;
        const dir = td[1] - td[0];
        if (dir === 0 || Math.abs(dir) > 3) continue;
        for (let j = 2; j < td.length; j++) {
          if (!isSafe(dir, td[j] - td[j - 1])) {
            safe = false;
            break;
          }
        }
        if (safe) {
          solution += 1;
          break;
        }
      }
    }
    return solution.toString();
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
