import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day03.data.ts';

export const meta: Meta = { year: 2024, day: 3, status: 'gold' };

export default function Day03() {
  function one(input: string) {
    return solve(input, 1);
  }

  function two(input: string): string {
    return solve(input, 2);
  }

  function solve(input: string, part: 1 | 2) {
    let i = 0;
    let enabled = true;
    let solution = 0;
    while (true) {
      const { action, index } = findNextCommand(input.slice(i));
      if (action === 'break') break;
      if (action === 'mul') {
        const mul = findNextMul(input.slice(i + index));
        if ((enabled || part === 1) && mul !== undefined) solution += mul;
      }
      if (action === 'do') enabled = true;
      if (action === 'dont') enabled = false;
      i += index;
    }
    return solution.toString();
  }

  function findNextCommand(str: string) {
    const MUL = str.indexOf('mul(');
    const DO = str.indexOf('do()');
    const DONT = str.indexOf(`don't()`);
    if (MUL < 0) return { action: 'break', index: -1 };
    if (DO < 0 && DONT < 0) return { action: 'mul', index: MUL + 4 };
    if (DO < 0) return MUL < DONT ? { action: 'mul', index: MUL + 4 } : { action: 'dont', index: DONT + 7 };
    if (DONT < 0) return MUL < DO ? { action: 'mul', index: MUL + 4 } : { action: 'do', index: DO + 4 };
    if (MUL < DO && MUL < DONT) return { action: 'mul', index: MUL + 4 };
    return DO < DONT ? { action: 'do', index: DO + 4 } : { action: 'dont', index: DONT + 7 };
  }

  function findNextMul(str: string) {
    const i = str.indexOf(',');
    if (i <= 0 || i > 3 || !isNum(str.slice(0, i))) return undefined;
    const a = parseInt(str.slice(0, i));
    const j = str.indexOf(')');
    if (j <= i + 1 || j > i + 4 || !isNum(str.slice(i + 1, j))) return undefined;
    const b = parseInt(str.slice(i + 1, j));
    return a * b;
  }

  function isNum(str: string) {
    return /^[0-9]+$/.test(str);
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
