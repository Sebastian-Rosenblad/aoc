import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day03.data.ts';

export const meta: Meta = { year: 2025, day: 3, status: 'gold' };

export default function Day03() {
  function parse(input: string) {
    const lines = input.split('\n');
    return lines.map(line => line.trim().split('').map(Number));
  }

  function one(input: string): string {
    const banks = parse(input);
    let solution = 0;
    for (let i = 0; i < banks.length; i++) {
      let max = Math.max(...banks[i]);
      let index = banks[i].indexOf(max);
      if (index === banks[i].length - 1) {
        max = Math.max(...banks[i].slice(0, index));
        index = banks[i].indexOf(max);
      }
      const secmax = Math.max(...banks[i].slice(index + 1));
      const val = `${max}${secmax}`;
      solution += parseInt(val);
    }
    return solution.toString();
  }

  function two(input: string): string {
    const banks = parse(input);
    let solution = 0;
    for (let i = 0; i < banks.length; i++) {
      let nums: number[] = [];
      while (nums.length < 12) {
        let max = Math.max(...banks[i]);
        let index = banks[i].indexOf(max);
        while (index >= banks[i].length - (11 - nums.length)) {
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
