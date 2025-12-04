import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day02.data.ts';

export const meta: Meta = { year: 2015, day: 2, status: 'gold' };

export default function Day02() {
  function parse(input: string) {
    const lines = input.split('\n');
    return lines.map(line => {
      const nums = line.split('x').map(Number);
      return { l: nums[0], w: nums[1], h: nums[2] };
    });
  }

  function one(input: string): string {
    const data = parse(input);
    let solution = 0;
    for (const box of data) {
      const lw = box.l * box.w;
      const wh = box.w * box.h;
      const hl = box.h * box.l;
      const st = Math.min(lw, wh, hl);
      solution += 2 * (lw + wh + hl) + st;
    }
    return solution.toString();
  }

  function two(input: string): string {
    const data = parse(input);
    let solution = 0;
    for (const box of data) {
      const sides = [box.l, box.w, box.h].sort((a, b) => a - b);
      const wrap = 2 * (sides[0] + sides[1]);
      const bow = box.l * box.w * box.h;
      solution += wrap + bow;
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
