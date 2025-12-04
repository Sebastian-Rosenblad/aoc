import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day03.data.ts';

export const meta: Meta = { year: 2025, day: 3, status: 'gold', times: { one: 348, two: 953 } };

export default function Day03() {
  function parse(input: string) {
    const lines = input.split('\n');
    return lines.map(line => line.trim().split('').map(Number));
  }

  function one(input: string): string {
    return solve(parse(input), 2);
  }

  function two(input: string): string {
    return solve(parse(input), 12);
  }

  function solve(banks: number[][], batteries: number) {
    let solution = 0;
    for (let i = 0; i < banks.length; i++) {
      let nums: number[] = [];
      while (nums.length < batteries) {
        let max = Math.max(...banks[i]);
        let index = banks[i].indexOf(max);
        while (index >= banks[i].length - (batteries - 1 - nums.length)) {
          max = Math.max(...banks[i].slice(0, index));
          index = banks[i].indexOf(max);
        }
        nums.push(max);
        banks[i].splice(0, index + 1);
      }
      solution += parseInt(nums.join(''));
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
