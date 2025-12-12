import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day15.data.ts';

export const meta: Meta = { year: 2023, day: 15, status: 'gold', times: { one: 353, two: 2836 } };

interface Lens {
  label: string;
  focal: number;
}

interface Step extends Lens {
  operation: '=' | '-';
}

export default function Day15() {
  const record: Record<string, number> = {};

  function parse(input: string) {
    const lines = input.split(',');
    return lines;
  }

  function parseSteps(lines: string[]) {
    return lines.map(line => {
      const i = line.indexOf('=');
      if (i > 0) return {
        label: line.substring(0, i),
        operation: '=',
        focal: parseInt(line.substring(i + 1))
      } as Step;
      return {
        label: line.substring(0, line.indexOf('-')),
        operation: '-',
        focal: -1
      } as Step;
    });
  }

  function one(input: string): string {
    return parse(input).map(step => hash(step)).reduce((a, b) => a + b, 0).toString();
  }

  function two(input: string): string {
    const steps = parseSteps(parse(input));
    const boxes = getFinalBoxes(steps);
    let solution = 0;
    for (let i = 0; i < boxes.length; i++) {
      for (let j = 0; j < boxes[i].length; j++) {
        solution += (i + 1) * (j + 1) * boxes[i][j].focal;
      }
    }
    return solution.toString();
  }

  function hash(chars: string): number {
    if (record[chars] !== undefined) return record[chars];
    let current: number = 0;
    chars.split('').forEach(char => {
      current += char.charCodeAt(0);
      current *= 17;
      current %= 256;
    });
    record[chars] = current;
    return current;
  }

  function getFinalBoxes(steps: Step[]) {
    const boxes = new Array(256).fill([]).map(_ => [] as Lens[]);
    for (const step of steps) {
      const box = boxes[hash(step.label)];
      const i = box.findIndex(b => b.label === step.label);
      if (i >= 0) {
        if (step.operation === '=') box[i].focal = step.focal;
        else box.splice(i, 1);
      } else if (step.operation === '=') box.push({ label: step.label, focal: step.focal });
    }
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
