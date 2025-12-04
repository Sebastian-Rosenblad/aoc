import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day17.data.ts';

export const meta: Meta = { year: 2023, day: 17, status: 'gold', times: { one: 9200, two: 86400 } };

interface PathM {
  x: number;
  y: number;
  len: number;
  dir: boolean;
}

interface SpeedM {
  h: number;
  v: number;
}

export default function Day17() {
  function parse(input: string) {
    return input.split(/\r?\n/);
  }

  function one(input: string): string {
    return calculate(parse(input), true);
  }

  function two(input: string): string {
    return calculate(parse(input), false);
  }

  let width: number = 0, height: number = 0;

  function calculate(a: Array<string>, partOne: boolean): string {
    let time: number = Date.now();
    const city: Array<Array<number>> = transpose(a.map(b => b.split("").map(c => parseInt(c))));
    width = city.length; height = city[0].length;
    if (partOne) {
      let answer: string = GetShortestPath(city, { min: 1, max: 3 }).toString();
      console.log(Date.now() - time);
      return answer;
    }
    let answer: string = GetShortestPath(city, { min: 4, max: 10 }).toString();
    console.log(Date.now() - time);
    return answer;
  }

  function GetShortestPath(city: Array<Array<number>>, walk: { min: number, max: number }): number {
    const longest: number = width * height * 9;
    let speed: Array<Array<SpeedM>> = new Array(width).fill(-1).map(() => new Array(height).fill(-1).map(() => {
      return { h: longest, v: longest };
    }));
    speed[0][0] = { h: 0, v: 0 };
    let paths: Array<PathM> = [{ x: 0, y: 0, len: 0, dir: true }, { x: 0, y: 0, len: 0, dir: false }];
    let shortest: number = longest;
    while (paths.length > 0) {
      let path: PathM | undefined = paths.shift();
      if (path !== undefined) {
        let origin: number = path.dir ? path.x : path.y;
        let newPaths: Array<PathM> = [
          ...GetNewPaths(origin, origin - walk.min, origin - walk.max, origin + walk.max, -1, city, speed, path),
          ...GetNewPaths(origin, origin + walk.min, origin - walk.max, origin + walk.max, 1, city, speed, path)
        ];
        newPaths.forEach(path => {
          if (path.dir) speed[path.x][path.y].v = path.len;
          else speed[path.x][path.y].h = path.len;
        });
        shortest = Math.min(shortest, speed[width - 1][height - 1].h, speed[width - 1][height - 1].v);
        paths = [
          ...paths.filter(path => !newPaths.find(newPath => newPath.x === path.x && newPath.y === path.y && newPath.dir === path.dir)),
          ...newPaths
        ].filter(path => path.len < shortest - city[width - 1][height - 1]).sort((a, b) => a.len - b.len);
      }
    }
    return shortest;
  }

  function GetNewPaths(origin: number, start: number, min: number, max: number, change: number, city: Array<Array<number>>, speed: Array<Array<SpeedM>>, path: PathM): Array<PathM> {
    let newPaths: Array<PathM> = [];
    let newLength: number = path.len;
    for (let i = origin + change; i >= min && i <= max; i += change) {
      let newx: number = path.dir ? i : path.x, newy: number = path.dir ? path.y : i;
      if (newx < 0 || newx >= width || newy < 0 || newy >= height) continue;
      newLength += city[newx][newy];
      if (change < 0 ? i > start : i < start) continue;
      if (newLength < (path.dir ? speed[newx][newy].h : speed[newx][newy].v))
        newPaths.push({ x: newx, y: newy, len: newLength, dir: !path.dir });
    }
    return newPaths;
  }

  function transpose<T>(array: Array<Array<T>>): Array<Array<T>> {
    return array[0].map((_, i) => array.map(row => row[i]));
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
