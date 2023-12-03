import './DayThree.scss';
import { dayThreeData } from './data';
import { dayThreeExample } from './example_data';

function DayThree() {
  const data: Array<string> = dayThreeData.split(/\r?\n/);
  const exampleData: Array<string> = dayThreeExample.split(/\r?\n/);

  /**
   * Part 1: time 00:34:26 - rank 3749
   * Part 2: time 01:30:48 - rank 6849
   */

  function calculate(a: Array<string>, partOne: boolean): string {
    if (partOne)
      return a.map((line, i) => findPartNumbers(line, a[i-1], a[i+1]).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0).toString();
    return a.map((line, i) => findGears(line, a[i-1], a[i+1]).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0).toString();
  }
  function findPartNumbers(line: string, before: string | null, after: string | null): Array<number> {
    let numbers: Array<string> = line.match(/\d+/g) || [];
    let indexes: Array<number> = [];
    for (let i = 0; i < numbers.length; i++) {
      let origin: number = i === 0 ? 0 : indexes[i-1] + numbers[i-1].length;
      indexes.push(line.slice(origin).indexOf(numbers[i]) + origin);
    }
    return numbers.filter((number, i) => search(indexes[i], indexes[i] + number.length, line, before, after, /[^0-9.]/)).map(number => parseInt(number));
  }
  function search(start: number, end: number, line: string, before: string | null, after: string | null, lookingFor: RegExp) {
    start = start - 1 >= 0 ? start - 1 : 0;
    end = end + 1 < line.length ? end + 1 : line.length - 1;
    if (before && lookingFor.test(before.slice(start, end))) return true;
    if (lookingFor.test(line.slice(start, end))) return true;
    if (after && lookingFor.test(after.slice(start, end))) return true;
    return false;
  }
  function findGears(line: string, before: string | null, after: string | null): Array<number> {
    let indexes: Array<number> = [];
    for (let i = 0; i < line.length; i++) if (line[i] === '*') indexes.push(i);
    return indexes.map(index => gearRatio(index, line, before, after));
  }
  function gearRatio(start: number, line: string, before: string | null, after: string | null): number {
    let adjacent: Array<number> = findAdjacent(start - 1 >= 0 ? start - 1 : 0, start + 2 < line.length ? start + 2 : line.length - 1, line, before, after);
    return adjacent.length === 2 ? adjacent[0] * adjacent[1] : 0;
  }
  function findAdjacent(start: number, end: number, line: string, before: string | null, after: string | null): Array<number> {
    let adjacent: Array<Array<number>> = [];
    let r: RegExp = /\d+/g;
    if (before) adjacent.push(before.slice(start, end).match(r)?.map((a, i) => findNumber(start + (i > 0 ? 2 : before.slice(start, end).indexOf(a)), before)) || []);
    adjacent.push(line.slice(start, end).match(r)?.map((a, i) => findNumber(start + (i > 0 ? 2 : line.slice(start, end).indexOf(a)), line)) || []);
    if (after) adjacent.push(after.slice(start, end).match(r)?.map((a, i) => findNumber(start + (i > 0 ? 2 : after.slice(start, end).indexOf(a)), after)) || []);
    return adjacent.flat();
  }
  function findNumber(index: number, line: string): number {
    let start: number = index, end: number = index;
    while (start > 0 && isDigit(line[start])) start--;
    while (end < line.length && isDigit(line[end])) end++;
    let number: string = line.slice(start, end);
    if (!isDigit(number[0])) number = number.slice(1);
    return parseInt(number);
  }
  function isDigit(char: string): boolean {
    return char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57;
  }

  return (
    <div className='day-three'>
      <p>Day three: Part 1</p>
      <h1>Answer: {calculate(data, true)}</h1>
      <h2>Example: {calculate(exampleData, true)}</h2>
      <p>Part 2</p>
      <h1>Answer: {calculate(data, false)}</h1>
      <h2>Example: {calculate(exampleData, false)}</h2>
    </div>
  );
}

export default DayThree;
