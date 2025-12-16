import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day23.data.ts';

export const meta: Meta = { year: 2023, day: 23, status: 'gold', times: { one: 86400 }, note: 'Part 2 real input takes up to 1 and a half minute' };

interface v2d {
  x: number;
  y: number;
}

interface Junction {
  pos: v2d;
  paths: Path[];
}

interface Path {
  out: v2d;
  len: number;
  dest: v2d;
}

export default function Day23() {
  let map: string[];
  let ice: boolean;

  function parse(input: string) {
    map = input.trim().split('\n');
    return { start: { x: map[0].indexOf('.'), y: 0 } as v2d, end: { x: map[map.length - 1].indexOf('.'), y: map.length - 1 } as v2d };
  }

  function one(input: string): string {
    const { start, end } = parse(input);
    ice = true;
    return getLongestHikeLength(start, end).toString();
  }

  function two(input: string): string {
    const { start, end } = parse(input);
    ice = false;
    return getLongestHikeLength(start, end).toString();
  }

  function getLongestHikeLength(startPos: v2d, endPos: v2d) {
    const junctions = [{
      pos: startPos,
      paths: [{
        out: { x: startPos.x, y: startPos.y + 1 },
        len: -1,
        dest: { x: -1, y: -1 }
      }]
    }, ...getJunctions()];
    calculateJunctionPaths(junctions, endPos);
    //console.log(junctions);
    return bruteForceSearch(junctions, junctions[0], [], endPos, 0, 0);
  }

  function bruteForceSearch(all: Junction[], current: Junction, seen: string[], end: v2d, length: number, max: number): number {
    const key = current.pos.x + ',' + current.pos.y;
    if (seen.includes(key)) return max;
    let newMax = max;
    for (const path of current.paths) {
      if (isEquals(path.dest, end)) {
        newMax = Math.max(newMax, length + path.len);
        continue;
      }
      const pathLength = bruteForceSearch(
        all,
        all.find(j => isEquals(j.pos, path.dest))!,
        [...seen, key],
        end,
        length + path.len,
        newMax
      );
      if (pathLength > newMax) newMax = pathLength;
    }
    return newMax;
  }

  function getJunctions() {
    let junctions: Junction[] = [];
    for (let j = 1; j < map.length - 1; j++) {
      for (let i = 1; i < map[0].length - 1; i++) {
        if (map[j][i] === '#') continue;
        let _in: v2d[] = [], _out: v2d[] = [];
        const directions: v2d[] = [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }];
        for (const dir of directions) {
          const pos = add({ x: i, y: j }, dir);
          if (map[pos.y][pos.x] === '.') _out.push(pos);
          else if (map[pos.y][pos.x] !== '#') {
            if (canTraverse(map[pos.y][pos.x], dir)) _out.push(pos);
            else _in.push(pos);
          }
        }
        if (!ice) { _out = _out.concat(_in); _in = []; }
        if (_out.length >= 3 || (_out.length >= 2 && _in.length > 0)) {
          const paths = _out.map(o => ({
            out: o,
            len: -1,
            dest: { x: -1, y: -1 }
          }));
          junctions.push({ pos: { x: i, y: j }, paths });
        }
      }
    }
    return junctions;
  }

  function calculateJunctionPaths(junctions: Junction[], end: v2d) {
    for (const junction of junctions) {
      for (const path of junction.paths) {
        if (path.len !== -1) continue;
        const steps = getSteps(path.out, junction.pos);
        const lastStep = steps[steps.length - 1];
        path.len = steps.length;
        path.dest = lastStep;
      }
    }
  }

  function getSteps(from: v2d, skip?: v2d) {
    const steps = [from];
    let neighbors = findNeighbors(from, skip);
    let prev = from;
    while (neighbors.length === 1) {
      const current = neighbors[0];
      steps.push(current);
      neighbors = findNeighbors(current, prev);
      prev = current;
    }
    return steps;
  }

  function findNeighbors(origin: v2d, skip?: v2d) {
    let steps: v2d[] = [];
    const directions: v2d[] = [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }];
    for (const dir of directions) {
      const pos = add(origin, dir);
      if (
        isWithinBounds(pos) &&
        canTraverse(map[pos.y][pos.x], dir) &&
        !isEquals(pos, skip)
      ) steps.push(pos);
    }
    return steps;
  }

  function canTraverse(terrain: string, dir: v2d) {
    if (terrain === '.') return true;
    if (terrain === '#') return false;
    if (!ice) return true;
    if (terrain === '<' && dir.x === -1) return true;
    if (terrain === '>' && dir.x === 1) return true;
    if (terrain === '^' && dir.y === -1) return true;
    if (terrain === 'v' && dir.y === 1) return true;
    return false;
  }

  function isWithinBounds(pos: v2d) {
    return pos.x >= 0 && pos.x < map[0].length && pos.y >= 0 && pos.y < map.length;
  }

  function isEquals(a: v2d, b?: v2d) {
    if (!b) return false;
    return a.x === b.x && a.y === b.y;
  }

  function add(a: v2d, b: v2d): v2d {
    return { x: a.x + b.x, y: a.y + b.y };
  }
  
  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
