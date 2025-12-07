import './Visualization.scss';
import { Link } from 'react-router-dom';

interface Props {
  day: number;
  year: number;
  render: {
    one?: (input: 'example' | 'real') => void;
    two?: (input: 'example' | 'real') => void;
  };
  children: React.ReactNode;
}

export default function Visualization({ day, year, render, children }: Props) {
  return (
    <article className='visualization'>
      <h1><Link to={`/${year}/day/${day}`}>&lt;</Link> Visualization - Day {day} Year {year}</h1>
      <div className='visualization-content'>
        <section className='sidebar'>
          {render.one !== undefined && (
            <>
              {render.two !== undefined && <h2>Part One</h2>}
              <button onClick={() => render.one?.('example')}>[Example]</button>
              <button onClick={() => render.one?.('real')}>[Real]</button>
            </>
          )}
          {render.two !== undefined && (
            <>
              {render.one !== undefined && <h2>Part Two</h2>}
              <button onClick={() => render.two?.('example')}>[Example]</button>
              <button onClick={() => render.two?.('real')}>[Real]</button>
            </>
          )}
        </section>
        <section className='component'>
          {children}
        </section>
      </div>
    </article>
  );
}
