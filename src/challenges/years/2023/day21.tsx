import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day21.data.ts';

export const meta: Meta = { year: 2023, day: 21, status: 'gold' };

interface v2d {
  x: number;
  y: number;
}

export default function Day21() {
  function parse(input: string) {
    const lines = input.split('\n');
    let start: v2d = { x: 0, y: 0 };
    for (let i = 0; i < lines.length; i++) if (lines[i].includes('S')) start = { x: lines[i].indexOf('S'), y: i };
    return { start, lines };
  }

  function one(input: string): string {
    const { start, lines } = parse(input);
    const steps = lines.length > 20 ? 64 : 6;
    return findPositions(start, steps, lines).toString();
  }

  function two(input: string): string {
    const { start, lines } = parse(input);
    if (lines.length <= 20) return findPositions(start, 1000, lines, true).toString();
    const steps = 26501365;
    const size = lines.length;
    const offset = Math.floor(size / 2);
    const f = [
      findPositions(start, offset, lines, true),
      findPositions(start, offset + size, lines, true),
      findPositions(start, offset + size * 2, lines, true)
    ];
    const a = (f[2] - 2 * f[1] + f[0]) / 2;
    const b = f[1] - f[0] - a;
    const c = f[0];
    const k = (steps - offset) / size;
    return (a * k * k + b * k + c).toString();
  }

  function findPositions(start: v2d, steps: number, map: string[], infinite: boolean = false) {
    const positions: [Set<string>, Set<string>] = [new Set<string>([toKey(start)]), new Set<string>()];
    let newPositions: v2d[] = [start];
    for (let i = 1; i <= steps; i++) {
      const neighbors = getNeighbors(newPositions, map, infinite);
      newPositions = [];
      for (const n of neighbors) {
        const key = toKey(n);
        if (!positions[i % 2].has(key)) {
          positions[i % 2].add(key);
          newPositions.push(n);
        }
      }
    }
    return positions[steps % 2].size;
  }

  function getNeighbors(positions: v2d[], map: string[], infinite: boolean) {
    let results: v2d[] = [];
    for (const pos of positions) {
      const neighbors = getNeighborsOf(pos, map, infinite);
      for (const n of neighbors) results.push(n);
    }
    return Array.from(results);
  }

  function getNeighborsOf(v: v2d, map: string[], infinite: boolean) {
    let results: v2d[] = [];
    const deltas = [
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 }
    ];
    for (const d of deltas) {
      const neighbor = { x: v.x + d.x, y: v.y + d.y };
      if (!infinite) {
        if (map[neighbor.y] && map[neighbor.y][neighbor.x] && map[neighbor.y][neighbor.x] !== '#') results.push(neighbor);
      } else {
        const mapX = ((neighbor.x % map[0].length) + map[0].length) % map[0].length;
        const mapY = ((neighbor.y % map.length) + map.length) % map.length;
        if (map[mapY][mapX] !== '#') results.push({ x: neighbor.x, y: neighbor.y });
      }
    }
    return results;
  }

  function toKey(v: v2d) {
    return `${v.x},${v.y}`;
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
