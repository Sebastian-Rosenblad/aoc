import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day07.data.ts';

export const meta: Meta = { year: 2023, day: 7, status: 'gold', times: { one: 2706, two: 3021 } };

interface HandM {
  bid: number;
  score: number;
}

export default function Day07() {
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
    let hands: Array<HandM> = a.map(line => {
      return {
        bid: parseInt(line.split(' ')[1]),
        score: findScore(line.split(' ')[0], !partOne)
      };
    });
    return hands.sort((a, b) => a.score - b.score).map((hand, i) => hand.bid * (i + 1)).reduce((a, b) => a + b, 0).toString();
  }

  function findScore(hand: string, joker: boolean): number {
    const types: Array<string> = joker ? ['A','K','Q','T','9','8','7','6','5','4','3','2','J'] : ['A','K','Q','J','T','9','8','7','6','5','4','3','2'];
    let amount: Array<number> = new Array(types.length).fill(0);
    for (let i = 0; i < hand.length; i++) amount[types.indexOf(hand[i])] += 1;
    if (joker) {
      let jokers: number = amount[types.indexOf('J')];
      amount[types.indexOf('J')] = 0;
      amount[amount.indexOf(Math.max(...amount))] += jokers;
    }
    let score: string = initalScore(amount);
    for (let i = 0; i < hand.length; i++) score += 30 - types.indexOf(hand[i]);
    return parseInt(score);
  }

  function initalScore(amount: Array<number>): string {
    if (amount.includes(5)) return '7';
    if (amount.includes(4)) return '6';
    if (amount.includes(3) && amount.includes(2)) return '5';
    if (amount.includes(3)) return '4';
    if (amount.filter(num => num === 2).length === 2) return '3';
    if (amount.includes(2)) return '2';
    return '1';
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
