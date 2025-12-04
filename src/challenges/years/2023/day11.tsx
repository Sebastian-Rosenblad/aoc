import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day11.data.ts';

export const meta: Meta = { year: 2023, day: 11, status: 'gold', times: { one: 1747, two: 3133 } };

interface CoordsM {
  x: number;
  y: number;
}

export default function Day11() {
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
    let galaxies: Array<CoordsM> = a.map((line, i) => findGalaxies(line).map(j => {
      return { x: j, y: i }
    })).flat();
    const emptyspace = {
      x: new Array(a[0].length).fill(-1).map((n, i) => columnHasGalaxy(a, i) ? -1 : i).filter(n => n >= 0),
      y: a.map((line, i) => line.includes('#') ? -1 : i).filter(n => n >= 0)
    };
    let distances: Array<number> = [];
    for (let i = 0; i < galaxies.length; i++) {
      for (let j = i + 1; j < galaxies.length; j++) {
        if (partOne) distances.push(distance(galaxies[i], galaxies[j], emptyspace, 1));
        else distances.push(distance(galaxies[i], galaxies[j], emptyspace, 999999));
      }
    }
    return distances.reduce((a, b) => a + b, 0).toString();
  }

  function findGalaxies(line: string): Array<number> {
    let galaxies: Array<number> = [];
    for (let i = 0; i < line.length; i++) if (line[i] === '#') galaxies.push(i);
    return galaxies;
  }

  function columnHasGalaxy(space: Array<string>, column: number): boolean {
    for (let i = 0; i < space.length; i++) if (space[i][column] === '#') return true;
    return false;
  }

  function distance(a: CoordsM, b: CoordsM, emptyspace: { x: Array<number>, y: Array<number> }, expanded: number): number {
    let xb: number = emptyspace.x.filter(cx => inbetween(cx, a.x, b.x)).length * expanded;
    let yb: number = emptyspace.y.filter(cy => inbetween(cy, a.y, b.y)).length * expanded;
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + xb + yb;
  }

  function inbetween(v: number, a: number, b: number): boolean {
    if (a > b && v > b && v < a) return true;
    if (b > a && v > a && v < b) return true;
    return false;
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
