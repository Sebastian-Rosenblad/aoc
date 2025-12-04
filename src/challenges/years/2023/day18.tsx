import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day18.data.ts';

export const meta: Meta = { year: 2023, day: 18, status: 'gold', times: { one: 86400, two: 86400 } };

interface DigM {
  pos: CoordsM;
  type: string;
  len: number;
}

interface WallM {
  x: number;
  sy: number;
  ey: number;
}

interface ChangeM {
  y: number;
  count: number;
}

interface EdgeM {
  x: number;
  type: string;
}

interface CoordsM {
  x: number;
  y: number;
}

export default function Day18() {
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
    let position: CoordsM = { x: 0, y: 0 };
    let from: string = partOne ? a[a.length - 1].split(" ")[0] : ToDir(a[a.length - 1].split(" ")[2].slice(-2, -1));
    let walls: Array<WallM> = [];
    let plan: Array<DigM> = a.map(line => {
      const coords: CoordsM = { x: position.x, y: position.y };
      const temp: Array<string> = line.split(" ");
      const lenght: number = partOne ? parseInt(temp[1]) : parseInt(temp[2].slice(2, -2), 16);
      const to: string = partOne ? temp[0] : ToDir(temp[2].slice(-2, -1));
      const type: string = ToType(from, to);
      from = to;
      if (lenght > 1 && (to === "U" || to === "D")) {
        const sy: number = to === "D" ? position.y + 1 : position.y - lenght + 1;
        const ey: number = to === "D" ? position.y + lenght - 1 : position.y - 1;
        walls.push({ x: position.x, sy: sy, ey: ey });
      }
      position.x += to === "L" ? -lenght : (to === "R" ? lenght : 0);
      position.y += to === "U" ? -lenght : (to === "D" ? lenght : 0);
      return { pos: coords, type: type, len: lenght };
    });
    let changes: Array<ChangeM> = plan.sort((a, b) => a.pos.y - b.pos.y).map(dig => { return { y: dig.pos.y, count: 1 }; });
    changes = changes.filter((change, i) => changes.findIndex(c => c.y === change.y) === i);
    let additional: Array<ChangeM> = [];
    for (let i = 1; i < changes.length; i++) {
      if (changes[i].y - changes[i - 1].y > 1) {
        additional.push({ y: changes[i].y - 1, count: changes[i].y - changes[i - 1].y - 1 });
      }
    }
    changes = changes.concat(additional);
    let count: number = 0;
    changes.forEach(change => count += RowContent(change.y, plan, walls) * change.count);
    let answer: string = count.toString();
    return answer;
  }

  let ToDir = (char: string): string => ["R","D","L","U"][parseInt(char)];

  function ToType(from: string, to: string): string {
    if (from === "U") return to === "L" ? "7" : "F";
    if (from === "D") return to === "L" ? "J" : "L";
    if (from === "L") return to === "U" ? "L" : "F";
    return to === "U" ? "J" : "7";
  }

  function RowContent(y: number, plan: Array<DigM>, walls: Array<WallM>): number {
    let edges: Array<EdgeM> = [
      ...plan.filter(dig => dig.pos.y === y).map(dig => { return { x: dig.pos.x, type: dig.type }; }),
      ...walls.filter(wall => wall.sy <= y && wall.ey >= y).map(wall => { return { x: wall.x, type: "|" }; })
    ].sort((a, b) => a.x - b.x);
    let content: number = 0;
    while (edges.length > 0) {
      let start: EdgeM | undefined = edges.shift();
      if (start !== undefined) {
        let s: number = start.x, e: number = start.x;
        let check: EdgeM | undefined = edges.shift();
        let prev: Array<string> = [];
        while (check !== undefined && !DoesEnd(start.type, check.type, prev)) {
          prev.push(check.type);
          if (check.x < s) s = check.x;
          if (check.x > e) e = check.x;
          check = edges.shift();
        }
        if (check !== undefined) {
          if (check.x < s) s = check.x;
          if (check.x > e) e = check.x;
          content += Math.abs(s - e) + 1;
        }
      }
    }
    return content;
  }

  function DoesEnd(start: string, check: string, prev: Array<string>): boolean {
    if (start === "F") {
      if ((check === "7" && !prev.includes("F")) || check === "|") return true;
      if (check === "J" && prev.includes("F")) return true;
      return false;
    }
    if (start === "L") {
      if ((check === "J" && !prev.includes("L")) || check === "|") return true;
      if (check === "7" && prev.includes("L")) return true;
      return false;
    }
    if (check === "|") return true;
    if (check === "J" && prev.includes("F")) return true;
    if (check === "7" && prev.includes("L")) return true;
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
