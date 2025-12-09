import './Visualization.scss';
import { Link } from 'react-router-dom';

interface Props {
  day: number;
  year: number;
  render: (input: 'example' | 'real') => void;
  children: React.ReactNode;
}

export default function Visualization({ day, year, render, children }: Props) {
  return (
    <article className='visualization'>
      <h1><Link to={`/${year}/day/${day}`}>&lt;</Link> Visualization - Day {day} Year {year}</h1>
      <div className='visualization-content'>
        <section className='sidebar'>
          <button onClick={() => render('example')}>[Example]</button>
          <button onClick={() => render('real')}>[Real]</button>
        </section>
        <section className='component'>
          {children}
        </section>
      </div>
    </article>
  );
}
