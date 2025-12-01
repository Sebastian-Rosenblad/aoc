import Template from './Template.tsx';
import type { Meta } from '../challenges/types.ts';
import { real, example } from './dayTemp.data.ts';

export const meta: Meta = { year: 2025, day: 1, status: 'started' };

export default function Day02() {
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
      meta={{ year: 0, day: 0, status: 'started' }}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
