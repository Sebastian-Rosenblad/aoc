import { useRef, useState } from 'react';
import Visualization from '../../../components/Visualization.tsx';
import { useAnimationLoop } from '../../../utils/useAnimationLoop.ts';
import { real, example } from './day08.data.ts';

interface v3d {
  x: number;
  y: number;
  z: number;
}

interface pair {
  a: number;
  b: number;
  distance: number;
}

interface line {
  from: v3d;
  to: v3d;
  color: string;
}

interface circuit {
  indexes: number[];
  lines: line[];
  color: string;
}

export default function Day08Visualization() {
  const [result, setResult] = useState<[number | undefined, number | undefined]>([undefined, undefined]);
  
  const aniSpeed = 125;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const points = useRef<v3d[]>([]);
  const distances = useRef<pair[]>([]);
  const circuits = useRef<circuit[]>([]);
  const distIndex = useRef(0);
  const linesPerUpdate = useRef(0);
  const partOneDone = useRef(0);
  const scale = useRef(0);

  const { start } = useAnimationLoop({
    animationSpeed: aniSpeed,
    initialize,
    step
  });

  function parse(input: string) {
    const lines  = input.split('\n');
    return lines.map((line, i) => {
      const n = line.trim().split(',').map(Number);
      return { x: n[0], y: n[1], z: n[2] } as v3d;
    });
  }

  function initialize(input: 'example' | 'real') {
    const data = parse(input === 'example' ? example : real);
    let dists: pair[] = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = i + 1; j < data.length; j++) {
        const dist = proximity(data[i], data[j]);
        dists.push({ a: i, b: j, distance: dist });
      }
    }
    points.current = data;
    distances.current = dists.sort((a, b) => a.distance - b.distance);
    circuits.current = data.map((_, i) => ({ color: randomColor(), lines: [], indexes: [i] }));
    distIndex.current = 0;
    linesPerUpdate.current = (input === 'example' ? 50 : 5000) / (5000 / aniSpeed);
    partOneDone.current = input === 'example' ? 10 : 1000;
    scale.current = input === 'example' ? .7 : .007;
    setResult([undefined, undefined]);
    drawDots(data);
  }

  function proximity(a: v3d, b: v3d): number {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2));
  }

  function step() {
    let i = distIndex.current, end = distIndex.current + linesPerUpdate.current;
    let drawLines: line[] = [];
    const cs = circuits.current;
    for (i; i < end; i++) {
      if (i === partOneDone.current - 1) setResult(prev => [
        cs.map(c => c.indexes.length)
          .sort((a, b) => b - a)
          .slice(0, 3)
          .reduce((a, b) => a * b, 1),
        prev[1]
      ]);
      let { a, b } = distances.current[i];
      let joint = -1;
      let double = false;
      for (let j = 0; j < cs.length; j++) {
        if (cs[j].indexes.includes(a)) {
          joint = j;
          if (!cs[j].indexes.includes(b)) {
            drawLines.push({ from: points.current[a], to: points.current[b], color: cs[j].color });
            cs[j].indexes.push(b);
            cs[j].lines.push({ from: points.current[a], to: points.current[b], color: cs[j].color });
          }
          else double = true;
          break;
        }
      }
      if (double) continue;
      for (let j = 0; j < cs.length; j++) {
        if (joint !== j && cs[j].indexes.includes(b)) {
          if (joint < 0) {
            cs[j].indexes.push(a);
            cs[j].lines.push({ from: points.current[a], to: points.current[b], color: cs[j].color });
            drawLines.push({ from: points.current[a], to: points.current[b], color: cs[j].color });
          }
          else {
            const merged = merge(cs[j], cs[joint]);
            drawLines.push(...merged.lines);
            cs[j] = merged;
            cs.splice(joint, 1);
          }
          break;
        }
      }
      if (cs.length === 1) {
        setResult(prev => [
          prev[0],
          points.current[a].x * points.current[b].x
        ]);
        break;
      }
    }
    circuits.current = cs;
    distIndex.current = i;
    draw(drawLines.filter((line, i) => {
      return drawLines.findLastIndex(l => l.from === line.from && l.to === line.to) === i;
    }));
    return cs.length === 1;
  }

  function merge(a: circuit, b: circuit): circuit {
    const merged = new Set<number>();
    a.indexes.forEach(n => merged.add(n));
    b.indexes.forEach(n => merged.add(n));
    const color = a.indexes.length > b.indexes.length ? a.color : b.color;
    return {
      color,
      lines: [...a.lines, ...b.lines].map(line => ({ ...line, color })),
      indexes: Array.from(merged)
    };
  }

  function drawDots(dots: v3d[]) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < dots.length; i++) {
      const p = pointOnCanvas(dots[i]);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#666';
      ctx.fill();
    }
  }

  function draw(lines: line[]) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    for (const line of lines) {
      const from = pointOnCanvas(line.from);
      const to = pointOnCanvas(line.to);
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.strokeStyle = line.color;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  function pointOnCanvas(p: v3d): v3d {
    const s = scale.current;
    return { x: p.x * s, y: p.y * s, z: p.z * s };
  }

  function randomColor(): string {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(40 + Math.random() * 61);
    const l = Math.floor(40 + Math.random() * 21);
    return `hsl(${h}, ${s}%, ${l}%)`;
  }

  return (
    <Visualization day={8} year={2025} render={start}>
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
        <p>Part 1: {result[0] === undefined ? '-' : result[0]}</p>
        <p>Part 2: {result[1] === undefined ? '-' : result[1]}</p>
      </div>
    </Visualization>
  );
}
