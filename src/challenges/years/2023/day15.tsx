import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day15.data.ts';

export const meta: Meta = { year: 2023, day: 15, status: 'other', times: { one: 353, two: 2836 } };

interface DataM {
  box: number;
  label: string;
  focal: number;
}

export default function Day15() {
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
    let steps: Array<string> = a[0].split(',');
    if (partOne)
      return steps.map(step => hash(step)).reduce((a, b) => a + b, 0).toString();
    let hashmap: Array<DataM> = a[0].split(',').map(step => {
      let l: string = step.includes('=') ? step.split('=')[0] : step.split('-')[0];
      return {
        box: hash(l),
        label: l,
        focal: step.includes('=') ? parseInt(step.split('=')[1]) : -1
      };
    });
    return boxes(hashmap).map((box, i) => box.map((slot, i) => slot.focal * (i + 1)).reduce((a, b) => a + b, 0) * (i + 1)).reduce((a, b) => a + b, 0).toString();
  }

  function hash(chars: string): number {
    let current: number = 0;
    chars.split('').forEach(char => {
      current += char.charCodeAt(0);
      current *= 17;
      current %= 256;
    });
    return current;
  }

  function boxes(hashmap: Array<DataM>): Array<Array<DataM>> {
    let boxes: Array<Array<DataM>> = new Array(256).fill(0).map(() => []);
    hashmap.forEach(h => {
      let box: number = hash(h.label);
      let index: number = boxes[box].findIndex(b => b.label === h.label);
      if (h.focal < 0) if (index >= 0) boxes[box].splice(index, 1);
      else {
        if (index >= 0) boxes[box][index] = h;
        else boxes[box].push(h);
      }
    });
    return boxes;
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
