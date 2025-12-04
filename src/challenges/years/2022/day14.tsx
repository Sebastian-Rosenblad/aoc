import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day14.data.ts';

export const meta: Meta = { year: 2022, day: 14, status: 'other' };

export default function Day14() {
  function parse(input: string) {
    return;
  }

  function one(input: string): string {
    const data = parse(input);
    let solution = 0;
    return solution.toString();
  }

  function two(input: string): string {
    const data = parse(input);
    let solution = 0;
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
