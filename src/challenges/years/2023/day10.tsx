import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day10.data.ts';

export const meta: Meta = { year: 2023, day: 10, status: 'gold', times: { one: 3912, two: 17346 } };

interface CoordsM {
  x: number;
  y: number;
  d: number;
  fx: number;
  fy: number;
}

export default function Day10() {
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
    let positions: Array<CoordsM> = [findStart(a), ...findStarts(a)];
    while (!meet(positions[positions.length - 2], positions[positions.length - 1])) {
      positions.push(findNext(positions[positions.length - 2], a));
      positions.push(findNext(positions[positions.length - 2], a));
    }
    positions.pop();
    if (partOne)
      return (positions.length / 2).toString();
    positions.sort((a, b) => {
      if (a.x !== b.x) return a.x - b.x;
      return a.y - b.y;
    });
    let tiles: Array<number> = [];
    for (let i = 0; i < a.length; i++) tiles.push(encloses(positions.filter(pos => pos.y === i), a[i]));
    return tiles.reduce((a, b) => a + b, 0).toString();
  }

  function findStarts(a: Array<string>): Array<CoordsM> {
    let start: CoordsM = findStart(a);
    let starts: Array<CoordsM> = [];
    if (start.y > 0 && (a[start.y - 1][start.x] === '7' || a[start.y - 1][start.x] === '|' || a[start.y - 1][start.x] === 'F'))
      starts.push({ x: start.x, y: start.y - 1, d: 1, fx: 0, fy: -1 });
    if (start.y < a.length - 1 && (a[start.y + 1][start.x] === 'J' || a[start.y + 1][start.x] === '|' || a[start.y + 1][start.x] === 'L'))
      starts.push({ x: start.x, y: start.y + 1, d: 1, fx: 0, fy: 1 });
    if (start.x > 0 && (a[start.y][start.x - 1] === 'F' || a[start.y][start.x - 1] === '-' || a[start.y][start.x - 1] === 'L'))
      starts.push({ x: start.x - 1, y: start.y, d: 1, fx: -1, fy: 0 });
    if (start.x < a[0].length - 1 && (a[start.y][start.x + 1] === '7' || a[start.y][start.x + 1] === '-' || a[start.y][start.x + 1] === 'J'))
      starts.push({ x: start.x + 1, y: start.y, d: 1, fx: 1, fy: 0 });
    return starts;
  }

  function findStart(a: Array<string>): CoordsM {
    for (let i = 0; i < a.length; i++)
      if (a[i].includes('S')) return { x: a[i].indexOf('S'), y: i, d: 0, fx: 0, fy: 0 };
    return { x: 0, y: 0, d: 0, fx: 0, fy: 0 };
  }

  function meet(a: CoordsM, b: CoordsM): boolean {
    if (a.x === b.x && a.y === b.y) return true;
    return false;
  }

  function findNext(coords: CoordsM, a: Array<string>): CoordsM {
    if (coords.fx === 1) {
      if (a[coords.y][coords.x] === 'J') return { x: coords.x, y: coords.y - 1, d: coords.d + 1, fx: 0, fy: -1 }
      if (a[coords.y][coords.x] === '-') return { x: coords.x + 1, y: coords.y, d: coords.d + 1, fx: 1, fy: 0 }
      return { x: coords.x, y: coords.y + 1, d: coords.d + 1, fx: 0, fy: 1 }
    }
    if (coords.fx === -1) {
      if (a[coords.y][coords.x] === 'L') return { x: coords.x, y: coords.y - 1, d: coords.d + 1, fx: 0, fy: -1 }
      if (a[coords.y][coords.x] === '-') return { x: coords.x - 1, y: coords.y, d: coords.d + 1, fx: -1, fy: 0 }
      return { x: coords.x, y: coords.y + 1, d: coords.d + 1, fx: 0, fy: 1 }
    }
    if (coords.fy === 1) {
      if (a[coords.y][coords.x] === 'J') return { x: coords.x - 1, y: coords.y, d: coords.d + 1, fx: -1, fy: 0 }
      if (a[coords.y][coords.x] === '|') return { x: coords.x, y: coords.y + 1, d: coords.d + 1, fx: 0, fy: 1 }
      return { x: coords.x + 1, y: coords.y, d: coords.d + 1, fx: 1, fy: 0 }
    }
    if (a[coords.y][coords.x] === '7') return { x: coords.x - 1, y: coords.y, d: coords.d + 1, fx: -1, fy: 0 }
    if (a[coords.y][coords.x] === '|') return { x: coords.x, y: coords.y - 1, d: coords.d + 1, fx: 0, fy: -1 }
    return { x: coords.x + 1, y: coords.y, d: coords.d + 1, fx: 1, fy: 0 }
  }

  function encloses(coords: Array<CoordsM>, line: string): number {
    let inside: boolean = false, tiles: number = 0;
    for (let i = 0; i < line.length; i++) {
      if (coords.find(coord => coord.x === i)) {
        if (line[i] === 'F' || line[i] === '7' || line[i] === '|') inside = !inside;
      }
      else if (inside) tiles += 1;
    }
    return tiles;
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
