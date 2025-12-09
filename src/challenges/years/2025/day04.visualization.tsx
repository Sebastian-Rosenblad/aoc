import { useRef, useState } from 'react';
import Visualization from '../../../components/Visualization.tsx';
import { useAnimationLoop } from '../../../utils/useAnimationLoop.ts';
import { real, example } from './day04.data.ts';

interface Cell {
  x: number;
  y: number;
  state: 1 | 2 | 3  | 4;
}

export default function Day04Visualization() {
  const [result, setResult] = useState<[number, number]>([-1, -1]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mapRef = useRef<string[]>([]);
  const cellsRef = useRef<Cell[]>([]);

  let cellSize = 0;

  const { start } = useAnimationLoop({
    animationSpeed: 75,
    initialize,
    step
  });

  function initialize(input: 'example' | 'real') {
    const data = (input === 'example' ? example : real).split('\n');
    cellSize = Math.floor(Math.min(700 / (data[0].length + 1), 700 / (data.length + 1)));
    cellsRef.current = cellsFromMap(data);
    mapRef.current = data;
    setResult([0, 0]);
  }

  function cellsFromMap(map: string[]) {
    const cells: Cell[] = [];
    for (let y = 0; y < map.length; y++)
      for (let x = 0; x < map[y].length; x++)
        if (map[y][x] === '@') cells.push({ x, y, state: 1 });
    return cells;
  }

  function step() {
    let newMap = mapRef.current.slice();
    const adjacents: number[][] = getHeightMap(newMap);
    const cellsToRemove: { x: number; y: number }[] = [];
    for (let i = 0; i < newMap.length; i++) {
      for (let j = 0; j < newMap[i].length; j++) {
        if (newMap[i][j] === '@' && adjacents[i][j] < 4) {
          newMap[i] = newMap[i].substring(0, j) + '.' + newMap[i].substring(j + 1);
          cellsToRemove.push({ x: j, y: i });
        }
      }
    }
    mapRef.current = newMap;
    let newCells = cellsRef.current.slice();
    for (let i = newCells.length - 1; i >= 0; i--) {
      if (newCells[i].state !== 1) newCells[i].state++;
      if (newCells[i].state > 4) newCells.splice(i, 1);
    }
    for (const rem of cellsToRemove) {
      for (const cell of newCells) {
        if (cell.x === rem.x && cell.y === rem.y) {
          cell.state = 2;
          break;
        }
      }
    }
    cellsRef.current = newCells;
    setResult(prev => {
      const newResult = prev[1] + cellsToRemove.length;
      return [prev[0] === 0 ? cellsToRemove.length : prev[0], newResult];
    });
    draw();
    return newCells.filter(cell => cell.state !== 1).length === 0;
  }

  function getHeightMap(map: string[]) {
    const heightMap: number[][] = new Array(map.length).fill(0).map(() => new Array(map[0].length).fill(0));
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        if (map[i][j] === '@') {
          for (let m = i - 1; m <= i + 1; m++) {
            for (let n = j - 1; n <= j + 1; n++) {
              if (m === i && n === j) continue;
              if (m >= 0 && m < map.length && n >= 0 && n < map[i].length) heightMap[m][n]++;
            }
          }
        }
      }
    }
    return heightMap;
  }

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const cells = cellsRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const radius = (cellSize * Math.SQRT2) / 2;
    const stateColors: Record<number, string> = {
      1: '#009900',
      2: '#999900',
      3: '#996600',
      4: '#990000',
    };
    const drawOrder = [1, 4, 3, 2];
    for (const state of drawOrder) {
      ctx.fillStyle = stateColors[state];
      for (const cell of cells) {
        if (cell.state !== state) continue;
        const cx = (cell.x + 1) * cellSize;
        const cy = (cell.y + 1) * cellSize;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  return (
    <Visualization day={4} year={2025} render={start}>
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
        <p>Part 1: {result[0] === -1 ? '-' : result[0]}</p>
        <p>Part 2: {result[1] === -1 ? '-' : result[1]}</p>
      </div>
    </Visualization>
  );
}
