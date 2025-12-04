import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day07.data.ts';

export const meta: Meta = { year: 2022, day: 7, status: 'other' };

export default function Day07() {
  function parse(input: string) {
    return;
  }

  function one(input: string): string {
    const data = parse(input);
    console.log(data);
    let solution = 0;
    return solution.toString();
  }

  function two(input: string): string {
    const data = parse(input);
    console.log(data);
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
