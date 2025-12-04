import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day02.data.ts';

export const meta: Meta = { year: 2022, day: 2, status: 'gold' };

export default function Day02() {
  function parse(input: string) {
    const lines = input.split('\n');
    return lines.map(line => line.trim().split(' '));
  }

  function one(input: string): string {
    const data = parse(input);
    let solution = 0;
    for (let i = 0; i < data.length; i++) {
      solution += shapeScore(data[i][1]) + resultScore(data[i][1], data[i][0]);
    }
    return solution.toString();
  }

  function two(input: string): string {
    const data = parse(input);
    let solution = 0;
    for (let i = 0; i < data.length; i++) {
      solution += shapeScore(changeShape(data[i][1], data[i][0])) + resultScore(changeShape(data[i][1], data[i][0]), data[i][0]);
    }
    return solution.toString();
  }

  function shapeScore(shape: string): number {
    switch (shape) {
      case 'X':
        return 1;
      case 'Y':
        return 2;
      default:
        return 3;
    }
  }

  function resultScore(shape: string, opponent: string): number {
    switch (shape) {
      case 'X':
        return opponent === 'A' ? 3 : opponent === 'B' ? 0 : 6;
      case 'Y':
        return opponent === 'A' ? 6 : opponent === 'B' ? 3 : 0;
      default:
        return opponent === 'A' ? 0 : opponent === 'B' ? 6 : 3;
    }
  }

  function changeShape(outcome: string, opponent: string): string {
    switch (outcome) {
      case 'X':
        return opponent === 'A' ? 'Z' : opponent === 'B' ? 'X' : 'Y';
      case 'Y':
        return opponent === 'A' ? 'X' : opponent === 'B' ? 'Y' : 'Z';
      default:
        return opponent === 'A' ? 'Y' : opponent === 'B' ? 'Z' : 'X';
    }
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
