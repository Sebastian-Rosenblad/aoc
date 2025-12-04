import './styles.scss';
import { Link } from 'react-router-dom';
import { FiCopy, FiExternalLink } from 'react-icons/fi';
import { challengesSorted } from '../challenges';
import Stars from '../components/Stars';
import copyText from '../utils/copy-text';

export default function Home() {
  const groups = challengesSorted.reduce<Record<number, typeof challengesSorted>>((acc, c) => {
    (acc[c.year] ||= []).push(c);
    return acc;
  }, {});

  return (
    <main className='main-menu'>
      <div className='main-header'>
        <h1>Advent of Code</h1>
        <h2 className='quiet'>Solutions by Sebastian Rosenblad</h2>
      </div>
      <ul>
        {Object.entries(groups).map(([year, items]) => (
          <li key={year}>
            <h2>{year}</h2>
            <ul>
              {items.map((c) => (
                <li key={c.path}>
                  <Link to={c.path}>Day {c.day.toString().padStart(2, '0')}</Link> <Stars status={c.status} />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <p className='small quiet'>Links:</p>
      <button onClick={() => copyText('npm run create-new-day')} className='small'><FiCopy /> [npm run create-new-day]</button>
      <a href='https://adventofcode.com/' target='_blank' rel='noopener noreferrer' className='small'><FiExternalLink /> Advent of Code</a>
    </main>
  );
}
