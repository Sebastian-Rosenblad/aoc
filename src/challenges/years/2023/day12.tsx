import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day12.data.ts';

export const meta: Meta = { year: 2023, day: 12, status: 'gold', times: { one: 2300, two: 27420 } };

interface SpringM {
  damaged: Array<number>;
  condition: string;
}

export default function Day12() {
  function parse(input: string) {
    return input.split(/\r?\n/);
  }

  function one(input: string): string {
    return calculate(parse(input), true);
  }

  function two(input: string): string {
    return calculate(parse(input), false);
  }

  let dictionary: { [key: string]: number } = {};

  function calculate(a: Array<string>, partOne: boolean): string {
    let springs: Array<SpringM> = a.map(line => {
      return {
        damaged: line.split(' ')[1].split(',').map(val => parseInt(val)),
        condition: line.split(' ')[0]
      };
    });
    if (partOne)
      return springs.map(spring => arrangements(spring)).reduce((a, b) => a + b, 0).toString();
    return springs.map(spring => arrangements({
      condition: [spring.condition, spring.condition, spring.condition, spring.condition, spring.condition].join('?'),
      damaged: [...spring.damaged, ...spring.damaged, ...spring.damaged, ...spring.damaged, ...spring.damaged]
    })).reduce((a, b) => a + b, 0).toString();
  }

  function arrangements(spring: SpringM): number {
    const key: string = spring.condition + spring.damaged.join(',');
    if (key in dictionary) return dictionary[key];
    if (spring.condition.length === 0) {
      if (spring.damaged.length === 0) return (dictionary[key] = 1);
      return (dictionary[key] = 0);
    }
    if (spring.damaged.length === 0) {
      for (let i = 0; i < spring.condition.length; i++) if (spring.condition[i] === '#') return (dictionary[key] = 0);
      return (dictionary[key] = 1);
    }
    if (spring.condition.length < spring.damaged.reduce((a, b) => a + b, 0) + spring.damaged.length - 1) return (dictionary[key] = 0);
    if (spring.condition[0] === '.') return (dictionary[key] = arrangements({ condition: spring.condition.slice(1), damaged: spring.damaged }));
    if (spring.condition[0] === '#') {
      let damage: number = spring.damaged[0];
      for (let i = 0; i < damage; i++) if (spring.condition[i] === '.') return (dictionary[key] = 0);
      if (spring.condition[damage] === '#') return (dictionary[key] = 0);
      return (dictionary[key] = arrangements({ condition: spring.condition.slice(damage + 1), damaged: spring.damaged.slice(1) }));
    }
    return (dictionary[key] = arrangements({ condition: spring.condition.slice(1), damaged: spring.damaged })
      + arrangements({ condition: '#' + spring.condition.slice(1), damaged: spring.damaged }));
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
