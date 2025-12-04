import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day01.data.ts';

export const meta: Meta = { year: 2022, day: 1, status: 'gold' };

export default function Day01() {
  function parse(input: string) {
    const lines = input.split('\n');
    const calories: number[][] = [[]];
    let i = 0;
    for (let j = 0; j < lines.length; j++) {
      if (lines[j].trim() === '') {
        i++;
        calories.push([]);
        continue;
      }
      calories[i].push(parseInt(lines[j].trim(), 10));
    }
    return calories;
  }

  function one(input: string): string {
    const data = parse(input);
    let solution = data
      .map(elf => elf.reduce((a, b) => a + b, 0))
      .sort((a, b) => b - a)[0];
    return solution.toString();
  }

  function two(input: string): string {
    const data = parse(input);
    let solution = data
      .map(elf => elf.reduce((a, b) => a + b, 0))
      .sort((a, b) => b - a)
      .slice(0, 3)
      .reduce((a, b) => a + b, 0);
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
