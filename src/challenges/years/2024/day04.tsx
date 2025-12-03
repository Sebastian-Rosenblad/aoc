import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day04.data.ts';

export const meta: Meta = { year: 2024, day: 4, status: 'gold' };

export default function Day04() {
  function parse(input: string) {
    return input.split('\n').map(line => line.trim());
  }

  function one(input: string): string {
    const data = parse(input);
    let solution = 0;
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length - 3; j++) {
        const word = data[i].substring(j, j + 4);
        if (word === 'XMAS' || word === 'SAMX') solution++;
      }
      if (i < data.length - 3) {
        for (let j = 0; j < data[i].length; j++) {
          const word = data[i][j] + data[i + 1][j] + data[i + 2][j] + data[i + 3][j];
          if (word === 'XMAS' || word === 'SAMX') solution++;
          if (j < data[i].length - 3) {
            const fall = data[i][j] + data[i + 1][j + 1] + data[i + 2][j + 2] + data[i + 3][j + 3];
            const rise = data[i + 3][j] + data[i + 2][j + 1] + data[i + 1][j + 2] + data[i][j + 3];
            if (fall === 'XMAS' || fall === 'SAMX') solution++;
            if (rise === 'XMAS' || rise === 'SAMX') solution++;
          }
        }
      }
    }
    return solution.toString();
  }

  function two(input: string): string {
    const data = parse(input);
    let solution = 0;
    for (let i = 1; i < data.length - 1; i++) {
      for (let j = 1; j < data[i].length - 1; j++) {
        if (data[i][j] === 'A') {
          if (
            (data[i - 1][j - 1] === 'M' && data[i + 1][j + 1] === 'S') ||
            (data[i + 1][j + 1] === 'M' && data[i - 1][j - 1] === 'S')
          ) {
            if (data[i - 1][j + 1] === 'M' && data[i + 1][j - 1] === 'S') solution++;
            else if (data[i + 1][j - 1] === 'M' && data[i - 1][j + 1] === 'S') solution++;
          }
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
