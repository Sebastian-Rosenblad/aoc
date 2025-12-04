import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day19.data.ts';

export const meta: Meta = { year: 2023, day: 19, status: 'gold', times: { one: 86400, two: 86400 } };

interface WorkflowM {
  label: string;
  rules: Array<RuleM>;
  default: string;
}

interface RuleM {
  type: "x" | "m" | "a" | "s";
  comp: ">" | "<";
  value: number;
  result: string;
}

interface PartM {
  x: number;
  m: number;
  a: number;
  s: number;
}

interface RangeM {
  x: { min: number; max: number; };
  m: { min: number; max: number; };
  a: { min: number; max: number; };
  s: { min: number; max: number; };
}

export default function Day19() {
  function parse(input: string) {
    return input.split(/\r?\n/);
  }

  function one(input: string): string {
    return calculate(parse(input), true);
  }

  function two(input: string): string {
    return calculate(parse(input), false);
  }

  let dictionary: { [key: string]: WorkflowM };

  function calculate(a: Array<string>, partOne: boolean): string {
    dictionary = {};
    const split: number = a.findIndex(line => line === "");
    const workflows: Array<WorkflowM> = RemoveRedundants(ParseWorkflows(a.slice(0, split)));
    workflows.forEach(workflow => dictionary[workflow.label] = workflow);
    if (partOne) {
      const parts: Array<PartM> = a.slice(split + 1).map(line => {
        const temp: Array<number> = line.slice(1, -1).split(",").map(value => parseInt(value.slice(2)));
        return { x: temp[0], m: temp[1], a: temp[2], s: temp[3] };
      });
      return parts.filter(part => TestPart(part, dictionary["in"])).map(part => part.x + part.m + part.a + part.s).reduce((a, b) => a + b, 0).toString();
    }
    return TestRange({
      x: { min: 1, max: 4000 },
      m: { min: 1, max: 4000 },
      a: { min: 1, max: 4000 },
      s: { min: 1, max: 4000 }
    }, dictionary["in"]).toString();
  }

  function ParseWorkflows(lines: Array<string>): Array<WorkflowM> {
    return lines.map(line => {
      const temp: Array<string> = line.split("{");
      const tempRules: Array<string> = temp[1].slice(0, -1).split(",");
      return {
        label: temp[0],
        rules: tempRules.slice(0, -1).map(rule => {
          return {
            type: rule.split(":")[0].slice(0, 1),
            comp: rule.split(":")[0].slice(1, 2),
            value: parseInt(rule.split(":")[0].slice(2)),
            result: rule.split(":")[1]
          } as RuleM;
        }),
        default: tempRules[tempRules.length - 1]
      };
    });
  }

  function RemoveRedundants(workflows: Array<WorkflowM>): Array<WorkflowM> {
    let redundant: Array<WorkflowM> = [];
    do {
      workflows.forEach(workflow => {
        while (workflow.rules.length > 0 && workflow.rules[workflow.rules.length - 1].result === workflow.default) workflow.rules.pop();
      });
      redundant = workflows.filter(workflow => workflow.rules.length === 0);
      redundant.forEach(red => {
        workflows.forEach(workflow => {
          if (workflow.default === red.label) workflow.default = red.default;
          workflow.rules.forEach(rule => {
            if (rule.result === red.label) rule.result = red.default;
          });
        });
      });
      workflows = workflows.filter(workflow => workflow.rules.length > 0);
    } while(redundant.length > 0);
    return workflows;
  }

  function TestPart(part: PartM, workflow: WorkflowM): boolean {
    for (let i = 0; i < workflow.rules.length; i++) {
      if (TestRule(part, workflow.rules[i])) {
        if (workflow.rules[i].result === "A") return true;
        if (workflow.rules[i].result === "R") return false;
        return TestPart(part, dictionary[workflow.rules[i].result]);
      }
    }
    if (workflow.default === "A") return true;
    if (workflow.default === "R") return false;
    return TestPart(part, dictionary[workflow.default]);
  }

  function TestRule(part: PartM, rule: RuleM): boolean {
    if (rule.comp === "<") return part[rule.type] < rule.value;
    return part[rule.type] > rule.value;
  }

  function TestRange(range: RangeM, workflow: WorkflowM): number {
    let count: number = 0;
    let current: RangeM = JSON.parse(JSON.stringify(range));
    for (let i = 0; i < workflow.rules.length; i++) {
      const rule: RuleM = workflow.rules[i];
      let split: RangeM = JSON.parse(JSON.stringify(current));
      split[rule.type] = {
        min: rule.comp === ">" ? (current[rule.type].min < rule.value + 1 ? rule.value + 1 : current[rule.type].min) : current[rule.type].min,
        max: rule.comp === "<" ? (current[rule.type].max > rule.value - 1 ? rule.value - 1 : current[rule.type].max) : current[rule.type].max
      };
      if (split[rule.type].min <= split[rule.type].max) {
        current[rule.type] = {
          min: rule.comp === "<" ? rule.value : current[rule.type].min,
          max: rule.comp === ">" ? rule.value : current[rule.type].max
        };
        if (current[rule.type].min > current[rule.type].max) {
          if (rule.result === "A") return count + SumRange(split);
          if (rule.result === "R") return count;
          return count + TestRange(split, dictionary[rule.result]);
        }
        if (rule.result === "A") count += SumRange(split);
        else if (rule.result !== "R") count += TestRange(split, dictionary[rule.result]);
      }
    }
    if (workflow.default === "A") return count + SumRange(current);
    if (workflow.default === "R") return count;
    return count + TestRange(current, dictionary[workflow.default]);
  }

  function SumRange(r: RangeM): number {
    return (r.x.max - r.x.min + 1) * (r.m.max - r.m.min + 1) * (r.a.max - r.a.min + 1) * (r.s.max - r.s.min + 1);
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
