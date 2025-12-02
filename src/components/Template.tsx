import { useState } from 'react';
import './Template.scss';
import { Link } from 'react-router-dom';
import { Meta } from '../challenges';
import Stars from './Stars';
import copyText from '../utils/copy-text';

interface Props {
  meta: Meta;
  methods: {
    one: (input: string) => string;
    two: (input: string) => string;
  };
  input: {
    example: string;
    real: string;
  }
}

export default function Template({ meta, methods, input }: Props) {
  const [solution, setSolution] = useState<{ one: string | null; two: string | null }>({ one: null, two: null });
  const [time, setTime] = useState<number | null>(null);

  function handleClick(part: 'one' | 'two', data: 'example' | 'real'): void {
    setTime(null);
    const start: number = performance.now();
    let solution: string = part === 'one' ?
      methods.one(data === 'real' ? input.real : input.example) :
      methods.two(data === 'real' ? input.real : input.example);
    setTime(performance.now() - start);
    setSolution((prev) => ({ ...prev, [part]: solution }));
    copyText(solution);
  }

  function renderBack() {
    return <Link to='/'>&lt;</Link>;
  }

  return (
    <article className='page'>
      <h1>{renderBack()} {meta.year} - Day {meta.day} <Stars status={meta.status} /></h1>
      <div className='row'>
        <p onClick={() => copyText(solution.one!)} className='solution'>Part 1: {solution.one || '-'}</p>
        <button onClick={() => handleClick('one', 'example')}>[Example]</button>
        <button onClick={() => handleClick('one', 'real')}>[Real]</button>
      </div>
      <div className='row'>
        <p onClick={() => copyText(solution.two!)} className='solution'>Part 2: {solution.two || '-'}</p>
        <button onClick={() => handleClick('two', 'example')}>[Example]</button>
        <button onClick={() => handleClick('two', 'real')}>[Real]</button>
      </div>
      {time !== null && <p>Calculated in {time.toFixed(2)} ms</p>}
    </article>
  );
}
