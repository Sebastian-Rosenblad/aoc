import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day12.data.ts';

export const meta: Meta = { year: 2025, day: 12, status: 'started' };

interface v2d {
  x: number;
  y: number;
}

interface area {
  width: number;
  height: number;
  shapeIndexes: number[];
}

export default function Day12() {
  function parse(input: string) {
    const lines = input.split('\n');
    const shapes: v2d[][] = [];
    let i = 0;
    while (lines[i].length === 2) {
      let shape : v2d[] = [];
      for (let j = i + 1; j <= i + 3; j++) {
        for (let k = 0; k < lines[j].length; k++) {
          if (lines[j][k] === '#') {
            shape.push({ x: k, y: j - (i + 1) });
          }
        }
      }
      shapes.push(shape);
      i += 5;
    }
    const areas: area[] = [];
    for (i; i < lines.length; i++) {
      const line = lines[i].split(': ');
      const size = line[0].split('x').map(Number);
      const indexes = line[1].split(' ').map(Number);
      areas.push({ width: size[0], height: size[1], shapeIndexes: indexes });
    }
    return { shapes, areas };
  }

  function one(input: string): string {
    const { shapes, areas } = parse(input);
    let count = [0, 0, 0]
    for (const area of areas) {
      count[testValidArea(area, shapes)]++;
    }
    return count[0].toString();
  }

  function testValidArea(area: area, shapes: v2d[][]): number {
    if (areaVerySpacious(area)) return 0;
    const emptySpace = getEmptySpace(area, shapes);
    if (emptySpace < 0) return 1;
    return 2;
  }

  function areaVerySpacious(area: area) {
    const areaSize = Math.floor(area.width / 3) * Math.floor(area.height / 3);
    const shapeCount = area.shapeIndexes.reduce((a, b) => a + b, 0);
    return areaSize >= shapeCount;
  }

  function getEmptySpace(area: area, shapes: v2d[][]) {
    const areaSize = area.width * area.height;
    const shapesSize = shapes
      .map(s => s.length)
      .map((s, i) => area.shapeIndexes[i] * s)
      .reduce((a, b) => a + b, 0);
    return areaSize - shapesSize;
  }

  function two(input: string): string {
    const { shapes, areas } = parse(input);
    let solution = 0;
    return solution.toString();
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
