import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day16.data.ts';

export const meta: Meta = { year: 2023, day: 16, status: 'other', times: { one: 8271, two: 9250 } };

interface CoordsM {
  x: number;
  y: number;
}

interface BeamM {
  x: number;
  y: number;
  dir: CoordsM;
  key: string;
}

interface ItemM {
  x: number;
  y: number;
  type: string;
}

export default function Day16() {
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
  let sims: number = 0;

  function calculate(a: Array<string>, partOne: boolean): string {
    width = a[0].length; height = a.length;
    let items: Array<ItemM> = [];
    for (let x = 0; x < width; x++) for (let y = 0; y < height; y++) if (a[y][x] !== ".") items.push({ x: x, y: y, type: a[y][x] });
    if (partOne)
      return simulate(beamify(0, 0, 1, 0), items).toString();
    let starts: Array<BeamM> = [];
    for (let x = 0; x < width; x++) { starts.push(beamify(x, 0, 0, 1)); starts.push(beamify(x, height - 1, 0, -1)); }
    for (let y = 0; y < height; y++) { starts.push(beamify(0, y, 1, 0)); starts.push(beamify(width - 1, y, -1, 0)); }
    sims = 0;
    let final: Array<number> = starts.map(start => simulate(start, items));
    return Math.max(...final).toString();
  }

  function simulate(start: BeamM, items: Array<ItemM>): number {
    console.log((sims++) + "/" + (width + height) * 2);
    let beams: Array<BeamM> = [start];
    let item: ItemM | undefined = items.find(i => i.x === start.x && i.y === start.y);
    if (item) beams = turn(beams[0], item.type);
    let history: Array<CoordsM> = move(beams, items, []).map(h => {
      return {
        x: parseInt(h.split(",")[0]),
        y: parseInt(h.split(",")[1])
      };
    });
    return history.filter((h, i) => history.findIndex(n => n.x === h.x && n.y === h.y) === i).length;
  }

  function move(beams: Array<BeamM>, items: Array<ItemM>, history: Array<string>): Array<string> {
    if (beams.length > 0) {
      let beam: BeamM = beams[0];
      if (history.includes(beam.key)) return move(beams.slice(1), items, history);
      let item: ItemM | undefined = undefined;
      if (beam.dir.x < 0) {
        let temp = items.filter(i => i.x < beam.x && i.y === beam.y);
        if (temp.length > 0) item = temp[temp.length - 1];
      }
      else if (beam.dir.x > 0) {
        let temp = items.filter(i => i.x > beam.x && i.y === beam.y);
        if (temp.length > 0) item = temp[0];
      }
      else if (beam.dir.y < 0) {
        let temp = items.filter(i => i.x === beam.x && i.y < beam.y);
        if (temp.length > 0) item = temp[temp.length - 1];
      }
      else if (beam.dir.y > 0) {
        let temp = items.filter(i => i.x === beam.x && i.y > beam.y);
        if (temp.length > 0) item = temp[0];
      }
      let length: number = 0;
      if (!item) {
        if (beam.dir.x < 0) length = beam.x + 1;
        else if (beam.dir.x > 0) length = width - beam.x;
        else if (beam.dir.y < 0) length = beam.y + 1;
        else if (beam.dir.y > 0) length = height - beam.y;
      }
      else length = Math.abs(item.x - beam.x + item.y - beam.y);
      for (let i = 0; i < length; i++) history.push((beam.x + beam.dir.x * i) + "," + (beam.y + beam.dir.y * i) + "," + beam.dir.x + "," + beam.dir.y);
      if (!item) return move(beams.slice(1), items, history);
      return move([...turn(beamify(item.x, item.y, beam.dir.x, beam.dir.y), item.type), ...beams.slice(1)], items, history);
    }
    return history;
  }

  function turn(beam: BeamM, type: string): Array<BeamM> {
    if (type === "/") return [beamify(beam.x, beam.y, -beam.dir.y, -beam.dir.x)];
    if (type === "L") return [beamify(beam.x, beam.y, beam.dir.y, beam.dir.x)];
    if (type === "|") {
      if (beam.dir.x === 0) return [beam];
      return [beamify(beam.x, beam.y, 0, -1), beamify(beam.x, beam.y, 0, 1)];
    }
    if (beam.dir.y === 0) return [beam];
    return [beamify(beam.x, beam.y, -1, 0), beamify(beam.x, beam.y, 1, 0)];
  }

  function beamify(x: number, y: number, dx: number, dy: number): BeamM {
    return { x: x, y: y, dir: { x: dx, y: dy }, key: x + "," + y + "," + dx + "," + dy };
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
