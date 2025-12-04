import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day03.data.ts';

export const meta: Meta = { year: 2023, day: 3, status: 'other' };

export default function Day03() {
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
