import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day03.data.ts';

export const meta: Meta = { year: 2022, day: 3, status: 'other' };

export default function Day03() {
  function parse(input: string) {
    return input.split('\n');
  }

  function one(input: string): string {
    const data = parse(input).map((line) => [line.slice(0, line.length / 2), line.slice(line.length / 2)]);
    return solve(data)
  }

  function two(input: string): string {
    const data = parse(input);
    const grouped: string[][] = [];
    for (let i = 0; i < data.length; i += 3) grouped.push([data[i], data[i + 1], data[i + 2]]);
    return solve(grouped);
  }

  function solve(data: string[][]) {
    const record: Record<string, number> = {};
    for (const item of data) {
      findCommonChar(...item).forEach(char => record[char] = (record[char] || 0) + 1);
    }
    let solution = 0;
    for (const char in record) solution += getPriority(char) * record[char];
    return solution.toString();
  }

  function findCommonChar(...str: string[]): string[] {
    let chars: Set<string> = new Set(str[0].split(''));
    for (let i = 1; i < str.length; i++) {
      let newChars: Set<string> = new Set();
      chars.forEach((char) => {
        if (str[i].includes(char)) newChars.add(char);
      });
      chars = newChars;
    }
    return Array.from(chars);
  }

  function getPriority(char: string): number {
    const code = char.charCodeAt(0);
    if (code >= 97 && code <= 122) return code - 96;
    if (code >= 65 && code <= 90) return code - 38;
    return 0;
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
