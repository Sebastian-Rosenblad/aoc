import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day01.data.ts';

export const meta: Meta = { year: 2015, day: 1, status: 'gold' };

export default function Day01() {
  function parse(input: string) {
    return input.split('');
  }

  function one(input: string): string {
    const data = parse(input);
    let solution = 0;
    for (let i = 0; i < data.length; i++) {
      solution += data[i] === '(' ? 1 : -1;
    }
    return solution.toString();
  }

  function two(input: string): string {
    const data = parse(input);
    let solution = 0;
    for (let i = 0; i < data.length; i++) {
      solution += data[i] === '(' ? 1 : -1;
      if (solution === -1) return (i + 1).toString();
    }
    return 'never';
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
