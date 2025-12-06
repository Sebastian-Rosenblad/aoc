import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day06.data.ts';

export const meta: Meta = { year: 2025, day: 6, status: 'gold', times: { one: 642, two: 2987 } };

export default function Day06() {
  function parse(input: string) {
    let lines = input.split('\n');
    let checker = lines.pop() as string;
    const operators: string[] = [];
    const numbers: string[][] = [];
    while (checker.length > 0) {
      let length = checker.length;
      if (checker.slice(1).indexOf('+') >= 0) length = checker.slice(1).indexOf('+');
      if (checker.slice(1).indexOf('*') >= 0) length = Math.min(length, checker.slice(1).indexOf('*'));
      const nums: string[] = [];
      for (let i = 0; i < lines.length; i++) nums.push(lines[i].slice(0, length));
      numbers.push(nums);
      operators.push(checker[0]);
      if (length === checker.length) break;
      checker = checker.slice(length + 1);
      lines = lines.map(line => line.slice(length + 1));
    }
    return { numbers, operators };
  }

  function one(input: string): string {
    return solution(input, 1);
  }

  function two(input: string): string {
    return solution(input, 2);
  }

  function solution(input: string, part: 1 | 2): string {
    const { numbers, operators } = parse(input);
    let solution = 0;
    for (let i = 0; i < operators.length; i++) {
      let nums: number[] = [];
      if (part === 1) nums = numbers[i].map(n => parseInt(n.trim()));
      else nums = convertNumbers(numbers[i]);
      solution += nums.reduce((a, b) => operators[i] === '+' ? a + b : a * b, operators[i] === '+' ? 0 : 1);
    }
    return solution.toString();
  }

  function convertNumbers(numbers: string[]): number[] {
    const toString = numbers.map(n => n.toString()).sort((a, b) => b.length - a.length);
    const converted: number[] = [];
    for (let i = toString[0].length - 1; i >= 0; i--) {
      let digits = '';
      for (let j = 0; j < toString.length; j++) digits += toString[j][i];
      converted.push(parseInt(digits));
    }
    return converted;
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
