import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types.ts';
import { real, example } from './day01.data.ts';

export const meta: Meta = { year: 2024, day: 1, status: 'gold' };

export default function Day01() {
  function parse(input: string) {
    let a: number[] = [], b: number[] = [];
    input.split('\n').forEach(line => {
      const ids = line.split(' ').filter(n => n !== '').map(n => parseInt(n));
      a.push(ids[0]);
      b.push(ids[1]);
    });
    return { a, b };
  }

  function one(input: string): string {
    const { a, b } = parse(input);
    const A = a.sort(), B = b.sort();
    let solution = 0;
    for (let i = 0; i < A.length; i++) solution += Math.abs(A[i] - B[i]);
    return solution.toString();
  }

  function two(input: string): string {
    const { a, b } = parse(input);
    let B: Record<number, number> = {};
    b.forEach(n => B[n] = (B[n] || 0) + 1);
    let solution = 0;
    for (let i = 0; i < a.length; i++) {
      const val = a[i];
      const mult = B[val] || 0;
      solution += val * mult;
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
