import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day01.data.ts';

export const meta: Meta = { year: 2023, day: 1, status: 'gold', times: { one: 651, two: 3490 } };

export default function Day01() {
  function parse(input: string) {
    return input.split(/\r?\n/);
  }

  function one(input: string): string {
    return calculate(parse(input), true);
  }

  function two(input: string): string {
    return calculate(parse(input), false);
  }

  function calculate(a: Array<string>, partOne: boolean): string {
    if (partOne)
      return a.map(line => findCalibration(line)).reduce((a, b) => a + b, 0).toString();
    return a.map(line => findTrueCalibration(line)).reduce((a, b) => a + b, 0).toString();
  }

  function findCalibration(line: string): number {
    const r: RegExp = /\d+/g;
    let digits: string = line.match(r)?.reduce((a, b) => a + b, '') || '0';
    return parseInt(digits[0] + digits[digits.length - 1]);
  }

  function findTrueCalibration(line: string): number {
    const r: RegExp = /(?:one|two|three|four|five|six|seven|eight|nine|\d+)/;
    let first: string = line.match(r)?.map(digit => toDigit(digit))[0].slice(0, 1) || '0';
    let i: number = line.length - 1;
    while (!line.slice(i).match(r)) i--;
    let last: string = line.slice(i).match(r)?.map(digit => toDigit(digit))[0] || '0';
    return parseInt(first + last);
  }

  function toDigit(word: string): string {
    switch (word) {
      case 'one': return '1';
      case 'two': return '2';
      case 'three': return '3';
      case 'four': return '4';
      case 'five': return '5';
      case 'six': return '6';
      case 'seven': return '7';
      case 'eight': return '8';
      case 'nine': return '9';
      default: return word;
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
