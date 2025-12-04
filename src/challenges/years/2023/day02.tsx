import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day02.data.ts';

export const meta: Meta = { year: 2023, day: 2, status: 'gold', times: { one: 1301, two: 1551 } };

interface GameM {
  id: number,
  sets: Array<SetM>
}

interface SetM {
  red: number;
  green: number;
  blue: number;
}

export default function Day02() {
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
    let games: Array<GameM> = a.map((line, i) => {
      return {
        id: parseInt(line.split(':')[0].split(' ')[1]),
        sets: line.split(': ')[1].split('; ').map(set => toSet(set))
      }
    });
    if (partOne)
      return games.filter(game => gamePossible(game)).reduce((a, b) => a + b.id, 0).toString();
    return games.map(game => gamePower(game)).reduce((a, b) => a + b, 0).toString();
  }

  function gamePossible(game: GameM): boolean {
    for (let i = 0; i < game.sets.length; i++) {
      if (game.sets[i].red > 12) return false;
      if (game.sets[i].green > 13) return false;
      if (game.sets[i].blue > 14) return false;
    }
    return true;
  }

  function gamePower(game: GameM): number {
    let least: SetM = { red: 0, green: 0, blue: 0 };
    game.sets.forEach(game => {
      if (game.red > least.red) least.red = game.red;
      if (game.green > least.green) least.green = game.green;
      if (game.blue > least.blue) least.blue = game.blue;
    });
    return least.red * least.green * least.blue;
  }

  function toSet(line: string): SetM {
    let draws: Array<string> = line.split(', ');
    let set: SetM = { red: 0, green: 0, blue: 0 };
    draws.forEach(draw => {
      let item: Array<string> = draw.split(' ');
      switch (item[1]) {
        case 'red': set.red += parseInt(item[0]); break;
        case 'green': set.green += parseInt(item[0]); break;
        case 'blue': set.blue += parseInt(item[0]); break;
        default: break;
      }
    });
    return set;
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
