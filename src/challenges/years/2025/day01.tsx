import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day01.data.ts';

export const meta: Meta = { year: 2025, day: 1, status: 'gold' };

export default function Day01() {
  function parse(input: string): number[] {
    return input.split('\n').map(line => {
      const dir = line[0];
      const dist = parseInt(line.slice(1), 10);
      return dir === 'L' ? -dist : dist;
    });
  }

  function calculateSolutionOne(input: string): string {
    let pos: number = 50;
    const parsed: number[] = parse(input);
    let zeros = 0;
    for (let move of parsed) {
      pos = (pos + move) % 100;
      if (pos === 0) zeros++;
    }
    return zeros.toString();
  }

  function calculateSolutionTwo(input: string): string {
    let pos: number = 50;
    const parsed: number[] = parse(input);
    let zeros = 0;
    for (let move of parsed) {
      let endpos = pos + move;
      if (pos === 0 && move < 0) zeros--;
      while (endpos < 0) { endpos += 100; zeros++; }
      while (endpos >= 100) { endpos -= 100; zeros++; }
      if (endpos === 0 && move < 0) zeros++;
      pos = endpos;
    }
    return zeros.toString();
  }

  return (
    <Template
      meta={meta}
      methods={{ one: calculateSolutionOne, two: calculateSolutionTwo }}
      input={{ example, real }}
    />
  );
}
