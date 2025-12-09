import { useRef, useState } from 'react';
import Visualization from '../../../components/Visualization.tsx';
import { useAnimationLoop } from '../../../utils/useAnimationLoop.ts';
import { real, example } from './day07.data.ts';

interface Beam {
  x: number;
  t: number;
}

export default function Day07Visualization() {
  const [display, setDisplay] = useState([<></>]);
  const [size, setSize] = useState<number>(0);

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const manifoldRef = useRef<string[]>([]);
  const beamsRef = useRef<Beam[]>([]);
  const indexRef = useRef<number>(0);
  const resultRef = useRef<number[]>([-1, -1]);

  const { start } = useAnimationLoop({
    animationSpeed: 125,
    initialize,
    step
  });

  function initialize(input: 'example' | 'real') {
    const data = (input === 'example' ? example : real).split('\n');
    setSize(Math.min((canvasRef.current?.clientWidth || 1000) / data[0].length, 35));
    setDisplay(data.map(line => <>{line}</>));
    manifoldRef.current = data;
    beamsRef.current = [{ x: data[0].indexOf('S'), t: 1 }];
    indexRef.current = 0;
    resultRef.current = [0, 1];
    return 2000 / data.length;
  }

  function step() {
    const index = indexRef.current + 1;
    const manifold = manifoldRef.current;
    const beams = beamsRef.current;
    let line = manifold[index];
    let newBeams: Beam[] = [];
    let newResult = resultRef.current.slice();
    for (const beam of beams) {
      if (line[beam.x] === '^') {
        newBeams.push({ x: beam.x - 1, t: beam.t });
        newBeams.push({ x: beam.x + 1, t: beam.t });
        newResult = [newResult[0] + 1, newResult[1] + beam.t];
      } else newBeams.push(beam);
    };
    newBeams = merge(newBeams);
    for (const beam of newBeams) line = line.substring(0, beam.x) + '|' + line.substring(beam.x + 1);
    const min = Math.min(...beams.map(b => b.t));
    const max = Math.max(...beams.map(b => b.t));
    resultRef.current = newResult;
    setDisplay(prev => prev.map((p, i) => i === index ? (
      <>{line.split('').map((c, j) => {
        const beam = newBeams.find(b => b.x === j);
        return beam ? <span style={{ color: getColor(beam.t, min, max) }}>|</span> : c;
      })}</>
    ) : p));
    beamsRef.current = newBeams;
    manifoldRef.current = manifold;
    indexRef.current = index;
    return index >= manifold.length - 1;
  }

  function merge(beams: Beam[]) {
    beams.sort((a, b) => a.x - b.x);
    const merged: Beam[] = [];
    for (const beam of beams) {
      const last = merged[merged.length - 1];
      if (last && last.x === beam.x) last.t += beam.t;
      else merged.push({ x: beam.x, t: beam.t });
    }
    return merged;
  }

  function getColor(t: number, min: number, max: number) {
    const intensity = Math.min(1, (t - min) / (max - min) || 0);
    const hue = 300 - 300 * intensity;
    return `hsl(${hue}, 100%, 50%)`;
  }

  return (
    <Visualization day={7} year={2025} render={start}>
      <div
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          overflowY: 'auto'
        }}
      >
        {display.map((d, i) => (
          <p key={i} className='quiet' style={{
            fontSize: `${size}px`
          }}>{d}</p>
        ))}
        <div style={{
          position: 'fixed',
          top: 30,
          left: 160
        }}>
          <p>Part 1: {resultRef.current[0] === -1 ? '-' : resultRef.current[0]}</p>
          <p>Part 2: {resultRef.current[1] === -1 ? '-' : resultRef.current[1]}</p>
        </div>
      </div>
    </Visualization>
  );
}
