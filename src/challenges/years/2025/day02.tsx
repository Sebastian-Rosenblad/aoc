import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day02.data.ts';

export const meta: Meta = { year: 2025, day: 2, status: 'gold', times: { one: 646, two: 1522 } };

export default function Day02() {
  function parse(input: string) {
    const parts = input.split(',');
    return parts.map(part => part.split('-').map(Number));
  }

  function one(input: string): string {
    const data = parse(input);
    let solution = 0;
    for (let i = 0; i < data.length; i++) {
      for (let j = data[i][0]; j <= data[i][1]; j++) {
        const str = j.toString();
        const l = str.length / 2;
        if (str.slice(0, l) === str.slice(l)) {
          solution += j;
        }
      }
    }
    return solution.toString();
  }

  function two(input: string): string {
    const data = parse(input);
    let solution = 0;
    for (let i = 0; i < data.length; i++) {
      for (let j = data[i][0]; j <= data[i][1]; j++) {
        const str = j.toString();
        const l = str.length;
        for (let k = 1; k <= l / 2; k++) {
          if (l % k === 0) {
            let segments: string[] = [];
            let match = true;
            for (let m = 0; m < l; m += k) {
              const ns = str.slice(m, m + k);
              if (segments.length !== segments.filter(s => s === ns).length) {
                match = false;
                break;
              }
              segments.push(ns);
            }
            if (match) {
              solution += j;
              break;
            }
          }
        }
      }
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
