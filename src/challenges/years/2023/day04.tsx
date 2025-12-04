import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day04.data.ts';

export const meta: Meta = { year: 2023, day: 4, status: 'gold', times: { one: 493, two: 960 } };

interface GameM {
  winning: Array<number>;
  pulled: Array<number>;
}

export default function Day04() {
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
    let games: Array<GameM> = a.map(line => {
      return {
        winning: line.split(': ')[1].split(' |')[0].split(' ').filter(word => word !== ' ' && word !== '').map(word => parseInt(word)),
        pulled: line.split(': ')[1].split('| ')[1].split(' ').filter(word => word !== ' ' && word !== '').map(word => parseInt(word))
      }
    });
    if (partOne)
      return games.map(game => gamePoints(winningNumbers(game))).reduce((a, b) => a + b, 0).toString();
    let cards: Array<number> = new Array(games.length).fill(1);
    let wins: Array<number> = games.map(game => winningNumbers(game));
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < wins[i]; j++) {
        if (i + j + 1 < cards.length) cards[i + j + 1] += cards[i];
      }
    }
    return cards.reduce((a, b) => a + b, 0).toString();
  }

  function winningNumbers(game: GameM): number {
    let wins: number = 0;
    game.pulled.forEach(pull => {
      if (game.winning.includes(pull)) wins += 1;
    });
    return wins;
  }

  function gamePoints(wins: number): number {
    return wins > 0 ? Math.pow(2, wins - 1) : 0;
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
