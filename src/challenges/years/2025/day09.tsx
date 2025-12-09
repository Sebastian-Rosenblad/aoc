import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day09.data.ts';

export const meta: Meta = { year: 2025, day: 9, status: 'gold', times: { one: 622, two: 3143 } };

interface v2d {
  x: number;
  y: number;
}

export default function Day09() {
  function parse(input: string) {
    const lines = input.split('\n');
    return lines.map((line) => {
      const numbers = line.split(',').map(Number);
      return { x: numbers[0], y: numbers[1] } as v2d;
    });
  }

  function one(input: string): string {
    return solve(input, 1);
  }

  function two(input: string): string {
    return solve(input, 2);
  }

  function solve(input: string, part: 1 | 2) {
    const data = parse(input);
    let solution = 0;
    for (let i = 0; i < data.length; i++) {
      for (let j = i + 1; j < data.length; j++) {
        const square = calcSquare(data[i], data[j]);
        if (square > solution && (part === 1 || checkInsideBounds(data[i], data[j], data))) {
          solution = square;
        }
      }
    }
    return solution.toString();
  }

  function calcSquare(a: v2d, b: v2d) {
    return (Math.abs(a.x - b.x) + 1) * (Math.abs(a.y - b.y) + 1);
  }

  function checkInsideBounds(a: v2d, b: v2d, points: v2d[]) {
    const minX = Math.min(a.x, b.x);
    const maxX = Math.max(a.x, b.x);
    const minY = Math.min(a.y, b.y);
    const maxY = Math.max(a.y, b.y);
    let prevX = points[points.length - 1].x <= minX ? -1 : points[points.length - 1].x >= maxX ? 1 : 0;
    let prevY = points[points.length - 1].y <= minY ? -1 : points[points.length - 1].y >= maxY ? 1 : 0;
    for (const point of points) {
      let newX = point.x <= minX ? -1 : point.x >= maxX ? 1 : 0;
      let newY = point.y <= minY ? -1 : point.y >= maxY ? 1 : 0;
      if (newX === 0 && newY === 0) return false;
      if (newX === 0 && prevY !== 0 && newY !== prevY) return false;
      if (newY === 0 && prevX !== 0 && newX !== prevX) return false;
      prevX = newX;
      prevY = newY;
    }
    return true;
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
