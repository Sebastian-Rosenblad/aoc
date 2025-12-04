import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day04.data.ts';

export const meta: Meta = { year: 2025, day: 4, status: 'gold', times: { one: 553, two: 709 } };

export default function Day04() {
  function parse(input: string) {
    return input.split('\n').map(line => line.trim().split(''));
  }

  function one(input: string): string {
    return solve(input, 1);
  }

  function two(input: string): string {
    return solve(input, 2);
  }

  function solve(input: string, part: 1 | 2) {
    const map = parse(input);
    let solution = 0, newRolls = 0;
    do {
      newRolls = 0;
      const adjacents: number[][] = getHeightMap(map);
      for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
          if (map[i][j] === '@' && adjacents[i][j] < 4) {
            solution++;
            newRolls++;
            map[i][j] = '.';
          }
        }
      }
    } while (part === 2 && newRolls > 0);
    return solution.toString();
  }

  function getHeightMap(map: string[][]) {
    const heightMap: number[][] = new Array(map.length).fill(0).map(() => new Array(map[0].length).fill(0));
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        if (map[i][j] === '@') {
          for (let m = i - 1; m <= i + 1; m++) {
            for (let n = j - 1; n <= j + 1; n++) {
              if (m === i && n === j) continue;
              if (m >= 0 && m < map.length && n >= 0 && n < map[i].length) heightMap[m][n]++;
            }
          }
        }
      }
    }
    return heightMap;
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
