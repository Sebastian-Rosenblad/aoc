import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day09.data.ts';

export const meta: Meta = { year: 2023, day: 9, status: 'gold', times: { one: 767, two: 971 } };

export default function Day09() {
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
    const series: Array<Array<number>> = a.map(line => line.split(' ').map(n => parseInt(n)));
    if (partOne)
      return series.map(serie => findNext(serie)).reduce((a, b) => a + b, 0).toString();
    return series.map(serie => findFirst(serie)).reduce((a, b) => a + b, 0).toString();
  }

  function findNext(serie: Array<number>): number {
    let newSerie: Array<number> = [];
    for (let i = 1; i < serie.length; i++) newSerie.push(serie[i] - serie[i - 1]);
    if (newSerie.filter(n => n === newSerie[0]).length === newSerie.length) return serie[serie.length - 1] + newSerie[0];
    return serie[serie.length - 1] + findNext(newSerie);
  }

  function findFirst(serie: Array<number>): number {
    let newSerie: Array<number> = [];
    for (let i = 1; i < serie.length; i++) newSerie.push(serie[i] - serie[i - 1]);
    if (newSerie.filter(n => n === newSerie[0]).length === newSerie.length) return serie[0] - newSerie[0];
    return serie[0] - findFirst(newSerie);
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
