import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day05.data.ts';

export const meta: Meta = { year: 2024, day: 5, status: 'silver' };

export default function Day05() {
  function parse(input: string) {
    const lines = input.split('\n').map(line => line.trim());
    let rules: number[][] = [], updates: number[][] = [];
    while (lines[0] !== '') rules.push((lines.shift() as string).split('|').map(Number));
    lines.shift();
    for (let i = 0; i < lines.length; i++) updates.push(lines[i].split(',').map(Number));
    return { rules, updates };
  }

  function one(input: string): string {
    return solve(input, 1);
  }

  function two(input: string): string {
    // <3442
    return solve(input, 2);
  }

  function solve(input: string, part: 1 | 2) {
    const { rules, updates } = parse(input);
    const ruleIndexes = getRuleIndexes(rules);
    const ruleOrder = part === 2 ? findCircularOrder(rules) : [];
    let solution = 0;
    for (let i = 0; i < updates.length; i++) {
      const applicableRuleIndexes = applicableRules(updates[i], ruleIndexes);
      const clone = JSON.parse(JSON.stringify(applicableRuleIndexes.map(index => rules[index])));
      const isRight = isRightOrder(updates[i], clone);
      if (isRight && part === 1) solution += updates[i][Math.floor(updates[i].length / 2)];
      if (!isRight && part === 2) {
        const updatedOrder = ruleOrder.filter(v => updates[i].includes(v));
        const index = Math.floor(updates[i].length / 2);
        solution += updatedOrder[index];
      }
    }
    return solution.toString();
  }

  function getRuleIndexes(rules: number[][]) {
    const ruleIndexes: Record<number, number[]> = {};
    for (let i = 0; i < rules.length; i++) {
      const [a, b] = rules[i];
      ruleIndexes[a] = ruleIndexes[a] ? [...ruleIndexes[a], i] : [i];
      ruleIndexes[b] = ruleIndexes[b] ? [...ruleIndexes[b], i] : [i];
    }
    return ruleIndexes;
  }

  function getRuleOrder(rules: number[][]) {
    const order = [];
    const accurances: Record<number, number> = {};
    for (let i = 0; i < rules.length; i++) {
      if (accurances[rules[i][0]]) accurances[rules[i][0]] += 1;
      else {
        order.push(rules[i][0]);
        accurances[rules[i][0]] = 1;
      }
    }
    console.log(accurances);
    return order.sort((a, b) => accurances[b] - accurances[a]);
  }

  function applicableRules(update: number[], ruleIndexes: Record<number, number[]>) {
    let applicable: number[] = [];
    for (let i = 0; i < update.length; i++) applicable = [...applicable, ...(ruleIndexes[update[i]] || [])];
    applicable = applicable.filter(v => applicable.filter(x => x === v).length === 2);
    return applicable.filter((v, i, a) => a.indexOf(v) === i);
  }

  function isRightOrder(update: number[], rules: number[][]) {
    for (let i = 0; i < update.length; i++) {
      for (let j = 0; j < rules.length; j++) {
        if (rules[j][0] === update[i]) rules[j].shift();
      }
    }
    return rules.filter(r => r.length > 0).length === 0;
  }

  function findCircularOrder(rules: number[][]) {
    const copy = JSON.parse(JSON.stringify(rules));
    const order = copy.shift() as number[];
    while (copy.length > 0) {
      const rule = copy.shift() as number[];
    }
    return order;
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
