import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day06.data.ts';

export const meta: Meta = { year: 2023, day: 6, status: 'gold', times: { one: 800, two: 971 } };

interface RecordM {
  time: number;
  dist: number;
}

export default function Day06() {
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
    let records: Array<RecordM> = [];
    a[0].split(':')[1].split(' ').filter(word => word !== '').forEach(number => records.push({
      time: parseInt(number),
      dist: 0
    }));
    a[1].split(':')[1].split(' ').filter(word => word !== '').forEach((number, i) => records[i].dist = parseInt(number));
    if (partOne)
      return records.map(record => waysToWin(record)).reduce((a, b) => a * b, 1).toString();
    return waysToWin(records.reduce((a, b) => {
      return {
        time: parseInt(a.time.toString() + b.time.toString()),
        dist: parseInt(a.dist.toString() + b.dist.toString())
      }
    })).toString();
  }

  function waysToWin(record: RecordM): number {
    let wins: number = 0;
    for (let i = 1; i < record.time - 1; i++) {
      if (distance(i, record.time) > record.dist) wins += 1;
    }
    return wins;
  }

  function distance(hold: number, time: number): number {
    return hold * (time - hold);
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
