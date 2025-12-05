import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day14.data.ts';

export const meta: Meta = { year: 2023, day: 14, status: 'gold', times: { one: 1116, two: 5107 }, note: 'Very slow part 2.' };

interface CoordsM {
  x: number;
  y: number;
}

export default function Day14() {
  function parse(input: string) {
    return input.split(/\r?\n/);
  }

  function one(input: string): string {
    return calculate(parse(input), true);
  }

  function two(input: string): string {
    return calculate(parse(input), false);
  }

  let history: Array<string> = [];

  function calculate(a: Array<string>, partOne: boolean): string {
    const height: number = a.length, width: number = a[0].length;
    let rocks: Array<CoordsM> = [], beams: Array<CoordsM> = [];
    for (let x = 0; x < a[0].length; x++) {
      for (let y = 0; y < a.length; y++) {
          if (a[y][x] === 'O') rocks.push({ x: x, y: y });
          else if (a[y][x] === '#') beams.push({ x: x, y: y });
      }
    }
    if (partOne)
      return slide(rocks, beams, { x: 0, y: -1 }, height, width).map(rock => height - rock.y).reduce((a, b) => a + b, 0).toString();
    let cycles: number = 1000000000;
    for (let i = 0; i < cycles; i++) {
      rocks = cycle(rocks, beams, height, width);
      let state: string = rocks.reduce((a, b) => a + ',' + b.x + ',' + b.y, '');
      if (history.includes(state)) {
        let loop: number = i - history.indexOf(state);
        i += Math.floor((cycles - i) / loop) * loop;
      }
      else history.push(state);
    }
    return rocks.map(rock => height - rock.y).reduce((a, b) => a + b, 0).toString();
  }
  
  function cycle(rocks: Array<CoordsM>, beams: Array<CoordsM>, height: number, width: number): Array<CoordsM> {
    let newrocks: Array<CoordsM> = slide(rocks.sort((a, b) => a.x !== b.x ? a.x - b.x : a.y - b.y), beams, { x: 0, y: -1 }, height, width);
    newrocks = slide(newrocks, beams, { x: -1, y: 0 }, height, width);
    newrocks = slide(newrocks.sort((a, b) => a.x !== b.x ? b.x - a.x : b.y - a.y), beams, { x: 0, y: 1 }, height, width);
    newrocks = slide(newrocks, beams, { x: 1, y: 0 }, height, width);
    return newrocks;
  }

  function slide(rocks: Array<CoordsM>, beams: Array<CoordsM>, dir: CoordsM, height: number, width: number): Array<CoordsM> {
    let slid: Array<CoordsM> = [];
    rocks.forEach(rock => {
      let blocking: Array<number> = [...slid.filter(r => isBlocking(r, rock, dir)), ...beams.filter(r => isBlocking(r, rock, dir))].map(r => dir.y !== 0 ? r.y : r.x);
      let slideto: number = blocking.length === 0 ? (dir.x + dir.y < 0 ? 0 : (dir.x > 0 ? width - 1 : height - 1)) :
        (dir.x + dir.y < 0 ? Math.max(...blocking) + 1 : Math.min(...blocking) - 1);
      if (dir.y !== 0)
        slid.push({ x: rock.x, y: slideto });
      else
        slid.push({ x: slideto, y: rock.y });
    });
    return slid;
  }

  function isBlocking(a: CoordsM, b: CoordsM, dir: CoordsM): boolean {
    if (dir.y === -1) return a.x === b.x && a.y < b.y;
    if (dir.y === 1) return a.x === b.x && a.y > b.y;
    if (dir.x === -1) return a.x < b.x && a.y === b.y;
    return a.x > b.x && a.y === b.y;
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
