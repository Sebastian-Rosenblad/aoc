import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day04.data.ts';

export const meta: Meta = { year: 2025, day: 4, status: 'gold' };

export default function Day04() {
  function parse(input: string) {
    return input.split('\n').map(line => line.trim().split(''));
  }

  function one(input: string): string {
    const data = parse(input);
    let solution = 0;
    const adjacents: number[][] = new Array(data.length).fill(0).map(() => new Array(data[0].length).fill(0));
    const rollsIndexes: number[] = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        if (data[i][j] === '@') {
          rollsIndexes.push(i, j);
          for (let m = i - 1; m <= i + 1; m++) {
            for (let n = j - 1; n <= j + 1; n++) {
              if (m === i && n === j) continue;
              if (m >= 0 && m < data.length && n >= 0 && n < data[i].length) adjacents[m][n]++;
            }
          }
        }
      }
    }
    for (let i = 0; i < rollsIndexes.length; i += 2) {
      if (adjacents[rollsIndexes[i]][rollsIndexes[i + 1]] < 4) solution++;
    }
    return solution.toString();
  }

  function two(input: string): string {
    const data = parse(input);
    let solution = 0;
    let newRolls = 0;
    do {
      newRolls = 0;
      const adjacents: number[][] = new Array(data.length).fill(0).map(() => new Array(data[0].length).fill(0));
      const rollsIndexes: number[] = [];
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
          if (data[i][j] === '@') {
            rollsIndexes.push(i, j);
            for (let m = i - 1; m <= i + 1; m++) {
              for (let n = j - 1; n <= j + 1; n++) {
                if (m === i && n === j) continue;
                if (m >= 0 && m < data.length && n >= 0 && n < data[i].length) adjacents[m][n]++;
              }
            }
          }
        }
      }
      for (let i = 0; i < rollsIndexes.length; i += 2) {
        if (adjacents[rollsIndexes[i]][rollsIndexes[i + 1]] < 4) {
          solution++;
          newRolls++;
          data[rollsIndexes[i]][rollsIndexes[i + 1]] = '.';
        }
      }
    } while (newRolls > 0);
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
