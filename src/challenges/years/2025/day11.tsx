import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day11.data.ts';

export const meta: Meta = { year: 2025, day: 11, status: 'gold', times: { one: 1441, two: 3947 } };

interface Path {
  length: number[];
  nodes: Set<string>;
}

export default function Day11() {
  function parse(input: string) {
    const lines = input.split('\n');
    const devices: Record<string, string[]> = {};
    for (const line of lines) {
      const split = line.split(': ');
      devices[split[0]] = split[1].split(' ');
    }
    return devices;
  }

  function one(input: string): string {
    const data = parse(input);
    let solution = findPaths('you', 'out', [], data);
    return solution.toString();
  }

  function findPaths(from: string, to: string, req: string[], devices: Record<string, string[]>): number {
    const ids = Object.keys(devices);
    const paths: Record<string, Path> = { [to]: { length: getPaddedArray(req.length), nodes: new Set() } };
    const found: string[] = [to];
    while (ids.length > 0) {
      let somethingFound = false;
      for (const id of ids) {
        if (devices[id].filter(d => !found.includes(d)).length === 0) {
          somethingFound = true;
          const node = ids.splice(ids.indexOf(id), 1)[0];
          let mergedLength = mergeLengths(devices[node].map(d => paths[d].length));
          const nds = paths[devices[node][0]].nodes;
          for (let j = 1; j < devices[node].length; j++) {
            paths[devices[node][j]].nodes.forEach(n => nds.add(n));
          }
          found.push(node);
          if (req.includes(node) && !nds.has(node)) {
            nds.add(node);
            mergedLength = moveLengthUp(mergedLength);
          }
          paths[node] = { length: mergedLength, nodes: nds };
          if (node === from) return mergedLength[req.length];
        }
      }
      if (!somethingFound) break;
    }
    return -1;
  }

  function getPaddedArray(length: number) {
    let a: number[] = [1];
    for (let i = 0; i < length; i++) a.push(0);
    return a;
  }

  function mergeLengths(lengths: number[][]) {
    const merged: number[] = [...lengths[0]];
    for (let i = 1; i < lengths.length; i++) {
      for (let j = 0; j < lengths[i].length; j++) {
        merged[j] += lengths[i][j];
      }
    }
    return merged;
  }

  function moveLengthUp(lengths: number[]) {
    let newLengths = [...lengths];
    for (let i = newLengths.length - 1; i > 0; i--) newLengths[i] = newLengths[i - 1];
    newLengths[0] = 0;
    return newLengths;
  }

  function two(input: string): string {
    const data = parse(input);
    let solution = findPaths('svr', 'out', ['fft', 'dac'], data);
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
