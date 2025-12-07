import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day07.data.ts';
import visualization from './day07.visualization.tsx';

export const meta: Meta = { year: 2025, day: 7, status: 'gold', times: { one: 944, two: 1373 }, visualization };

interface Beam {
  x: number;
  t: number;
}

export default function Day07() {
  function parse(input: string) {
    const start = input.split('\n')[0].indexOf('S');
    const lines = input.slice(1).split('\n');
    const splitters = lines.map((line) => {
      const ss: number[] = [];
      for (let i = 0; i < line.length; i++) if (line[i] === '^') ss.push(i);
      return ss;
    }).filter((s) => s.length > 0);
    return { start, splitters };
  }

  function one(input: string): string {
    return solve(input, 1);
  }

  function two(input: string): string {
    return solve(input, 2);
  }

  function solve(input: string, part: 1 | 2) {
    const { start, splitters } = parse(input);
    let beams: Beam[] = [{ x: start, t: 1 }];
    let solution = part - 1;
    for (const row of splitters) {
      const newBeams: Beam[] = [];
      for (const beam of beams) {
        if (row.includes(beam.x)) {
          newBeams.push({ x: beam.x - 1, t: beam.t });
          newBeams.push({ x: beam.x + 1, t: beam.t });
          solution += beam.t;
        } else newBeams.push(beam);
      };
      if (part === 1) beams = newBeams.filter((b, i) => newBeams.findIndex((bb) => bb.x === b.x) === i);
      else beams = merge(newBeams);
    }
    return solution.toString();
  }

  function merge(beams: Beam[]) {
    beams.sort((a, b) => a.x - b.x);
    const merged: Beam[] = [];
    for (const beam of beams) {
      const last = merged[merged.length - 1];
      if (last && last.x === beam.x) last.t += beam.t;
      else merged.push({ x: beam.x, t: beam.t });
    }
    return merged;
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
