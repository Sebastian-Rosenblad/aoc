import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day16.data.ts';

export const meta: Meta = { year: 2023, day: 16, status: 'gold', times: { one: 8271, two: 9250 } };

type Item = '|' | '-' | '\\' | '/';

interface v2d {
  x: number;
  y: number;
}

interface Beam {
  pos: v2d;
  dir: v2d;
}


export default function Day16() {
  function parse(input: string) {
    const lines = input.trim().split('\n');
    return lines;
  }

  function one(input: string): string {
    const data = parse(input);
    return getTotalEnergized({ pos: { x: 0, y: 0 }, dir: { x: 1, y: 0 } }, data).toString();
  }

  function two(input: string): string {
    const data = parse(input);
    let solution = 0;
    for (let x = 0; x < data[0].length; x++) {
      const total = Math.max(
        getTotalEnergized({ pos: { x, y: 0 }, dir: { x: 0, y: 1 } }, data),
        getTotalEnergized({ pos: { x, y: data.length - 1 }, dir: { x: 0, y: -1 } }, data),
      );
      if (total > solution) solution = total;
    }
    for (let y = 0; y < data.length; y++) {
      const total = Math.max(
        getTotalEnergized({ pos: { x: 0, y }, dir: { x: 1, y: 0 } }, data),
        getTotalEnergized({ pos: { x: data[0].length - 1, y }, dir: { x: -1, y: 0 } }, data),
      );
      if (total > solution) solution = total;
    }
    return solution.toString();
  }

  function getTotalEnergized(beam: Beam, map: string[]) {
    let paths = findAllPaths(beam, map);
    let positions: Set<string> = new Set();
    for (const key in paths)
      for (const pos of paths[key])
        positions.add(`${pos.x},${pos.y}`);
    return positions.size;
  }

  function findAllPaths(start: Beam, map: string[]) {
    const paths: Record<string, v2d[]> = {};
    let beamsToCheck = [start];
    while (beamsToCheck.length > 0) {
      const beam = beamsToCheck.shift()!;
      const key = toKey(beam);
      if (paths[key]) continue;
      const { path, next } = findPath(beam, map);
      beamsToCheck = [...beamsToCheck, ...next];
      paths[key] = path;
    }
    return paths;
  }

  function findPath(start: Beam, map: string[]) {
    const path = [start.pos];
    let pos: v2d = { x: start.pos.x, y: start.pos.y };
    while (map[pos.y][pos.x] === '.') {
      pos.x += start.dir.x;
      pos.y += start.dir.y;
      if (pos.x < 0 || pos.y < 0 || pos.x >= map[0].length || pos.y >= map.length) return { path, next: [] };
      path.push({ x: pos.x, y: pos.y });
    }
    const next = collideResult({ pos, dir: start.dir }, map[pos.y][pos.x] as Item)
      .filter(beam => beam.pos.x >= 0 && beam.pos.y >= 0 && beam.pos.x < map[0].length && beam.pos.y < map.length);
    return { path, next };
  }

  function collideResult(beam: Beam, item: Item) {
    switch (item) {
      case '|': return splitVertical(beam);
      case '-': return splitHorizontal(beam);
      case '/': return mirrorForward(beam);
      default: return mirrorBackward(beam);
    }
  }

  function splitVertical(beam: Beam) {
    if (beam.dir.y !== 0)
      return [{ pos: { x: beam.pos.x, y: beam.pos.y + beam.dir.y }, dir: beam.dir }] as Beam[];
    return [
      { pos: { x: beam.pos.x, y: beam.pos.y + 1 }, dir: { x: 0, y: 1 } },
      { pos: { x: beam.pos.x, y: beam.pos.y - 1 }, dir: { x: 0, y: -1 } },
    ] as Beam[];
  }
  
  function splitHorizontal(beam: Beam) {
    if (beam.dir.x !== 0)
      return [{ pos: { x: beam.pos.x + beam.dir.x, y: beam.pos.y }, dir: beam.dir }] as Beam[];
    return [
      { pos: { x: beam.pos.x + 1, y: beam.pos.y }, dir: { x: 1, y: 0 } },
      { pos: { x: beam.pos.x - 1, y: beam.pos.y }, dir: { x: -1, y: 0 } },
    ] as Beam[];
  }

  function mirrorForward(beam: Beam) {
    if (beam.dir.x !== 0)
      return [{ pos: { x: beam.pos.x, y: beam.pos.y - beam.dir.x }, dir: { x: 0, y: -beam.dir.x } }] as Beam[];
    return [{ pos: { x: beam.pos.x - beam.dir.y, y: beam.pos.y }, dir: { x: -beam.dir.y, y: 0 } }] as Beam[];
  }

  function mirrorBackward(beam: Beam) {
    if (beam.dir.x !== 0)
      return [{ pos: { x: beam.pos.x, y: beam.pos.y + beam.dir.x }, dir: { x: 0, y: beam.dir.x } }] as Beam[];
    return [{ pos: { x: beam.pos.x + beam.dir.y, y: beam.pos.y }, dir: { x: beam.dir.y, y: 0 } }] as Beam[];
  }

  function toKey(beam: Beam) {
    return `${beam.pos.x},${beam.pos.y},${beam.dir.x},${beam.dir.y}`;
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
