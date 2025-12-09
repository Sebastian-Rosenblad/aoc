import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day08.data.ts';
import visualization from './day08.visualization.tsx';

export const meta: Meta = { year: 2025, day: 8, status: 'gold', times: { one: 4744, two: 5057 }, visualization };

interface v3d {
  x: number;
  y: number;
  z: number;
}

interface pair {
  a: number;
  b: number;
  distance: number;
}

export default function Day08() {
  function parse(input: string) {
    const lines  = input.split('\n');
    return lines.map((line, i) => {
      const n = line.trim().split(',').map(Number);
      return { x: n[0], y: n[1], z: n[2] } as v3d;
    });
  }

  function one(input: string): string {
    return solution(input, 1);
  }

  function two(input: string): string {
    return solution(input, 2);
  }

  function solution(input: string, part: 1 | 2): string {
    const data = parse(input);
    let distances: pair[] = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = i + 1; j < data.length; j++) {
        const dist = proximity(data[i], data[j]);
        distances.push({ a: i, b: j, distance: dist });
      }
    }
    distances = distances.sort((a, b) => a.distance - b.distance);
    let connections = part === 1 ? (data.length > 50 ? 1000 : 10) : distances.length;
    const circuits: number[][] = data.map((_, i) => [i]);
    for (let i = 0; i < connections; i++) {
      let { a, b } = distances[i];
      let joint = -1;
      let double = false;
      for (let j = 0; j < circuits.length; j++) {
        if (circuits[j].includes(a)) {
          joint = j;
          if (!circuits[j].includes(b)) circuits[j].push(b);
          else double = true;
          break;
        }
      }
      if (double) continue;
      for (let j = 0; j < circuits.length; j++) {
        if (joint !== j && circuits[j].includes(b)) {
          if (joint < 0) circuits[j].push(a);
          else {
            const merged = merge([circuits[j], circuits[joint]]);
            circuits[j] = merged;
            circuits.splice(joint, 1);
          }
          joint = j;
          break;
        }
      }
      if (joint === -1) circuits.push([a, b]);
      if (part === 2 && circuits.length === 1) return (data[a].x * data[b].x).toString();
    }
    let solution = circuits
      .map(c => c.length)
      .sort((a, b) => b - a)
      .slice(0, 3)
      .reduce((a, b) => a * b, 1);
    return solution.toString();
  }

  function proximity(a: v3d, b: v3d): number {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2));
  }

  function merge(arr: [number[], number[]]): number[] {
    const merged = new Set<number>();
    for (const a of arr) a.forEach(n => merged.add(n));
    return Array.from(merged);
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
