import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day03.data.ts';

export const meta: Meta = { year: 2015, day: 3, status: 'gold' };

export default function Day03() {
  function parse(input: string) {
    return input.split('').map((char) => {
      switch (char) {
        case '^':
          return [0, 1];
        case 'v':
          return [0, -1];
        case '<':
          return [-1, 0];
        default:
          return [1, 0];
      }
    });
  }

  function one(input: string): string {
    const data = parse(input);
    const record: Record<string, number> = { '0,0': 1 };
    let pos = [0, 0];
    for (let i = 0; i < data.length; i++) {
      pos[0] += data[i][0];
      pos[1] += data[i][1];
      const key = pos.join(',');
      record[key] = (record[key] ?? 0) + 1;
    }
    return Object.keys(record).length.toString();
  }

  function two(input: string): string {
    const data = parse(input);
    const record: Record<string, number> = { '0,0': 2 };
    let a = [0, 0], b = [0, 0];
    for (let i = 0; i < data.length; i++) {
      var pos = i % 2 === 0 ? a : b;
      pos[0] += data[i][0];
      pos[1] += data[i][1];
      const key = pos.join(',');
      record[key] = (record[key] ?? 0) + 1;
    }
    return Object.keys(record).length.toString();
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
