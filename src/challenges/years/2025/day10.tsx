import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day10.data.ts';

export const meta: Meta = { year: 2025, day: 10, status: 'silver', times: { one: 2040 } };

interface Machine {
  lights: string[];
  buttons: number[][];
  joltage: number[];
}

export default function Day10() {
  function parse(input: string) {
    const lines = input.split('\n');
    const machines: Machine[] = [];
    for (const line of lines) {
      const li = line.indexOf(']');
      const lightStr = line.slice(1, li);
      const ji = line.indexOf('{');
      const buttonStr = line.slice(li + 3, ji - 2);
      const joltageStr = line.slice(ji + 1, -1);
      machines.push({
        lights: lightStr.split(''),
        buttons: buttonStr.split(') (').map(b => b.split(',').map(Number)),
        joltage: joltageStr.split(',').map(Number),
      });
    }
    return machines;
  }

  function one(input: string): string {
    const data = parse(input);
    let solution = 0;
    for (const machine of data) {
      solution += simLights(machine);
    }
    return solution.toString();
  }

  function simLights(machine: Machine): number {
    const target = machine.lights.join('');
    let presses = 0;
    const tested: string[] = [];
    let testing: string[][] = [new Array(machine.lights.length).fill('.')];
    while (true) {
      presses++;
      const newTesting: string[][] = [];
      for (const test of testing) {
        for (const button of machine.buttons) {
          let newLights = [...test];
          for (const index of button) newLights[index] = newLights[index] === '.' ? '#' : '.';
          const newLightStr = newLights.join('');
          if (newLightStr === target) return presses;
          if (tested.includes(newLightStr)) continue;
          tested.push(newLightStr);
          newTesting.push(newLights);
        }
      }
      testing = newTesting;
    }
  }

  function two(input: string): string {
    const data = parse(input);
    let solution = 0;
    for (const machine of data) {
      const target = machine.joltage;
      const buttons = machine.buttons.sort((a, b) => b.length - a.length);
      const value = bruteForce(target, buttons, 0);
      if (value >= 0) solution += value;
      else console.error('No solution found for machine', machine);
      console.log(value);
    }
    return solution.toString();
  }

  function bruteForce(target: number[], buttons: number[][], presses: number): number {
    if (target.every(t => t === 0)) return presses;
    if (buttons.length === 0) return -1;
    const button = buttons[0];
    const max = Math.min(...button.map(i => target[i]));
    for (let i = max; i >= 0; i--) {
      const newTarget = [...target];
      for (const index of button) newTarget[index] -= i;
      const result = bruteForce(newTarget, buttons.slice(1), presses + i);
      if (result >= 0) return result;
    }
    return -1;
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
