import { useRef, useState } from 'react';
import Visualization from '../../../components/Visualization.tsx';
import { useAnimationLoop } from '../../../utils/useAnimationLoop.ts';
import { real, example } from './day09.data.ts';

interface v2d {
  x: number;
  y: number;
}

interface rect {
  min: v2d;
  max: v2d;
}

export default function Day09Visualization() {
  const [result, setResult] = useState<[number, number]>([0, 0]);
  
  const resultRef = useRef<[number, number]>([0, 0]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const points = useRef<v2d[]>([]);
  const drawSize = useRef(1);
  const drawPoints = useRef<v2d[]>([]);
  const biggest = useRef<[rect | undefined, rect | undefined]>([undefined, undefined]);
  const checking = useRef<rect | undefined>(undefined);
  const i = useRef(0);

  const { start } = useAnimationLoop({
    animationSpeed: 1,
    initialize,
    step
  });

  function parse(input: string) {
    const lines = input.split('\n');
    return lines.map((line) => {
      const numbers = line.split(',').map(Number);
      return { x: numbers[0], y: numbers[1] } as v2d;
    });
  }

  function initialize(input: 'example' | 'real') {
    const data = parse(input === 'example' ? example : real);
    resultRef.current = [0, 0];
    points.current = data;
    drawSize.current = input === 'example' ? 60 : 0.007;
    drawPoints.current = [];
    biggest.current = [undefined, undefined];
    checking.current = undefined;
    i.current = 0;
    setResult([0, 0]);
    return input === 'example' ? 250 : 1;
  }

  function step() {
    if (drawPoints.current.length < points.current.length) {
      drawPoints.current.push(points.current[drawPoints.current.length]);
      draw();
      return false;
    }
    const a = points.current[i.current];
    let largestSize = 0;
    let largestPoint: v2d = { x: 0, y: 0 };
    for (let j = i.current + 1; j < points.current.length; j++) {
      const b = points.current[j];
      const size = calcSquare(a, b);
      if (size > largestSize) {
        largestSize = size;
        largestPoint = b;
      }
      if (size > resultRef.current[0]) {
        resultRef.current[0] = size;
        setResult([resultRef.current[0], resultRef.current[1]]);
        biggest.current[0] = getRect(a, b);
      }
      if (size > resultRef.current[1] && checkInsideBounds(a, b, points.current)) {
        resultRef.current[1] = size;
        setResult([resultRef.current[0], resultRef.current[1]]);
        biggest.current[1] = getRect(a, b);
      }
    }
    checking.current = getRect(a, largestPoint);
    if (i.current + 2 === drawPoints.current.length) {
      checking.current = undefined;
      draw();
      return true;
    }
    i.current += 1;
    draw();
    return false;
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

  function calcSquare(a: v2d, b: v2d) {
    return (Math.abs(a.x - b.x) + 1) * (Math.abs(a.y - b.y) + 1);
  }

  function getRect(a: v2d, b: v2d): rect {
    return {
      min: { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y) },
      max: { x: Math.max(a.x, b.x), y: Math.max(a.y, b.y) }
    };
  }

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const ps = [points.current[points.current.length - 1], ...drawPoints.current];
    for (let i = 1; i < ps.length; i++) {
      ctx.beginPath();
      ctx.moveTo(ps[i - 1].x * drawSize.current, ps[i - 1].y * drawSize.current);
      ctx.lineTo(ps[i].x * drawSize.current, ps[i].y * drawSize.current);
      ctx.strokeStyle = '#090';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    for (let i = 0; i < ps.length; i++) {
      ctx.beginPath();
      ctx.arc(ps[i].x * drawSize.current, ps[i].y * drawSize.current, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#900';
      ctx.fill();
    }
    if (biggest.current[0]) {
      ctx.beginPath();
      ctx.rect(
        biggest.current[0].min.x * drawSize.current,
        biggest.current[0].min.y * drawSize.current,
        (biggest.current[0].max.x - biggest.current[0].min.x) * drawSize.current,
        (biggest.current[0].max.y - biggest.current[0].min.y) * drawSize.current
      );
      ctx.strokeStyle = '#099';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#0099991a';
      ctx.fill();
    }
    if (biggest.current[1]) {
      ctx.beginPath();
      ctx.rect(
        biggest.current[1].min.x * drawSize.current,
        biggest.current[1].min.y * drawSize.current,
        (biggest.current[1].max.x - biggest.current[1].min.x) * drawSize.current,
        (biggest.current[1].max.y - biggest.current[1].min.y) * drawSize.current
      );
      ctx.strokeStyle = '#909';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#9900991a';
      ctx.fill();
    }
    if (checking.current) {
      ctx.beginPath();
      ctx.rect(
        checking.current.min.x * drawSize.current,
        checking.current.min.y * drawSize.current,
        (checking.current.max.x - checking.current.min.x) * drawSize.current,
        (checking.current.max.y - checking.current.min.y) * drawSize.current
      );
      ctx.strokeStyle = '#990';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#9999001a';
      ctx.fill();
    }
  }

  return (
    <Visualization day={9} year={2025} render={start}>
      <canvas
        ref={canvasRef}
        width={700}
        height={700}
      />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0
      }}>
        <p>Part 1: <span style={{ color: '#099' }}>{result[0]}</span></p>
        <p>Part 2: <span style={{ color: '#909' }}>{result[1]}</span></p>
      </div>
    </Visualization>
  );
}
