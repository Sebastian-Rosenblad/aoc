import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day05.data.ts';

export const meta: Meta = { year: 2023, day: 5, status: 'gold', times: { one: 1030, two: 3466 } };

export default function Day05() {
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
    let seeds: Array<number> = a[0].split(': ')[1].split(' ').map(line => parseInt(line));
    let maps: Array<Array<Array<number>>> = [];
    for (let i = 1; i < a.length; i++) {
      if (a[i] === '') maps.push([]);
      else if (!a[i].includes(':')) maps[maps.length - 1].push(a[i].split(' ').map(line => parseInt(line)));
    }
    if (partOne)
      return seeds.map(seed => toLocation(seed, maps)).sort((a, b) => a - b)[0].toString();
    let location: number = 0, seed: number = toSeed(location++, maps);
    while (!seedExists(seed, seeds)) seed = toSeed(location++, maps);
    return toLocation(seed, maps).toString();
  }

  function toLocation(seed: number, maps: Array<Array<Array<number>>>): number {
    maps.forEach(m => {
      seed = correspond(seed, m);
    });
    return seed;
  }

  function correspond(n: number, m: Array<Array<number>>): number {
    for (let i = 0; i < m.length; i++) {
      if (n >= m[i][1] && n < m[i][1] + m[i][2]) return n - m[i][1] + m[i][0];
    }
    return n;
  }

  function seedExists(seed: number, seeds: Array<number>): boolean {
    for (let i = 0; i < seeds.length; i += 2) {
      if (seed >= seeds[i] && seed < seeds[i] + seeds[i + 1]) return true;
    }
    return false;
  }

  function toSeed(location: number, maps: Array<Array<Array<number>>>): number {
    for (let i = maps.length - 1; i >= 0; i--) {
      location = reverse(location, maps[i]);
    }
    return location;
  }
  
  function reverse(n: number, m: Array<Array<number>>): number {
    for (let i = 0; i < m.length; i++) {
      if (n >= m[i][0] && n < m[i][0] + m[i][2]) return n + m[i][1] - m[i][0];
    }
    return n;
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
