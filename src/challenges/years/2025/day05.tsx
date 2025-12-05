import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day05.data.ts';

export const meta: Meta = { year: 2025, day: 5, status: 'gold', times: { one: 845, two: 937 } };

export default function Day05() {
  function parse(input: string) {
    const ranges: number[][] = [], ingredients: number[] = [];
    const lines = input.split('\n');
    let i = 0;
    while (lines[i] !== '') ranges.push(lines[i++].split('-').map(Number));
    while (i < lines.length) {
      if (lines[i] !== '') ingredients.push(Number(lines[i]));
      i++;
    }
    return { ranges: mergeRanges(ranges), ingredients };
  }

  function one(input: string): string {
    const { ranges, ingredients } = parse(input);
    let solution = 0;
    for (const ingredient of ingredients) {
      for (const [start, end] of ranges) {
        if (ingredient >= start && ingredient <= end) {
          solution++;
          break;
        }
      }
    }
    return solution.toString();
  }

  function two(input: string): string {
    const { ranges } = parse(input);
    let solution = 0;
    for (const range of ranges) solution += range[1] - range[0] + 1;
    return solution.toString();
  }

  function mergeRanges(ranges: number[][]): number[][] {
    ranges.sort((a, b) => a[0] - b[0]);
    const merged: number[][] = [];
    for (const range of ranges) {
      if (merged.length === 0 || merged[merged.length - 1][1] < range[0]) merged.push(range);
      else merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], range[1]);
    }
    return merged;
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
