import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day08.data.ts';

export const meta: Meta = { year: 2023, day: 8, status: 'gold', times: { one: 1780, two: 9881 } };

interface NodeM {
  id: string;
  left: string;
  right: string;
}

export default function Day08() {
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
    const instructions: string = a[0];
    const nodes: Array<NodeM> = a.slice(2).map(line => {
      return {
        id: line.split(' =')[0],
        left: line.split('= (')[1].split(', ')[0],
        right: line.split('= (')[1].split(', ')[1].slice(0,3),
      }
    });
    let pointers: Array<any> = nodes.map(node => {
      return { id: node.id }
    });
    pointers.forEach((pointer, i) => {
      pointer.con = [pointers.find(p => p.id === nodes[i].left), pointers.find(p => p.id === nodes[i].right)];
    });
    if (partOne) {
      let steps: number = 0, node: any = pointers.find(point => point.id === 'AAA');
      while (node.id !== 'ZZZ') {
        const turn: number = instructions[steps++ % instructions.length] === 'L' ? 0 : 1;
        node = node.con[turn];
      }
      return steps.toString();
    }
    let steps: number = 0, paths: Array<any> = pointers.filter(point => point.id[2] === 'A');
    while (paths.filter(path => typeof path !== 'number').length > 0) {
      for (let i = 0; i < paths.length; i++) {
        if (typeof paths[i] === 'number') continue;
        if (paths[i].id[2] === 'Z') paths[i] = steps;
        if (typeof paths[i] === 'number') continue;
        paths[i] = paths[i].con[instructions[steps % instructions.length] === 'L' ? 0 : 1];
      }
      steps++;
    }
    return paths.reduce((a: number, b: number) => lcm(a, b), 1).toString();
  }

  let lcm = (a: number, b: number): number => (a / gcd(a, b)) * b;

  function gcd(a: number, b: number): number {
    let n: number = 0;
    if (a < b) {
      n = b;
      b = a;
      a = n;
    }
    n = a % b;
    return n ? gcd(b, n) : b;
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
