import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day13.data.ts';

export const meta: Meta = { year: 2023, day: 13, status: 'gold', times: { one: 1387, two: 2143 } };

export default function Day13() {
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
    let patterns: Array<Array<string>> = [[]];
    for (let i = 0; i < a.length; i++) {
      if (a[i] === '') patterns.push([]);
      else patterns[patterns.length - 1].push(a[i]);
    }
    if (partOne)
      return patterns.map(pattern => reflectionValue(pattern, 0)).reduce((a, b) => a + b, 0).toString();
    return patterns.map(pattern => reflectionValue(pattern, 1)).reduce((a, b) => a + b, 0).toString();
  }

  function reflectionValue(pattern: Array<string>, errors: number): number {
    let mirrored: Array<string> = new Array(pattern[0].length).fill('');
    for (let i = 0; i < pattern.length; i++) for (let j = 0; j < mirrored.length; j++) mirrored[j] += pattern[i][j];
    return reflectionPoint(pattern, errors) * 100 + reflectionPoint(mirrored, errors);
  }
  
  function reflectionPoint(pattern: Array<string>, errors: number): number {
    for (let i = 0.5; i < pattern.length - 1; i += 0.5)
      if (mirrors(pattern, Math.floor(i), Math.floor(i + 1), 0, errors))
        return Math.floor(i + 1);
    return 0;
  }

  function mirrors(pattern: Array<string>, low: number, high: number, errors: number, maxErrors: number): boolean {
    if (low < 0 || high >= pattern.length) return errors === maxErrors;
    if (pattern[low] === pattern[high]) return mirrors(pattern, low - 1, high + 1, errors, maxErrors);
    let totalErrors = errors + differences(pattern[low], pattern[high]);
    if (totalErrors > maxErrors) return false;
    return mirrors(pattern, low - 1, high + 1, totalErrors, maxErrors);
  }

  function differences(a: string, b: string): number {
    let d: number = 0;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d += 1;
    return d;
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
