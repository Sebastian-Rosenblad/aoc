import { Link } from 'react-router-dom';
import { challengesSorted } from '../challenges';
import Stars from '../components/Stars';

export default function Home() {
  const groups = challengesSorted.reduce<Record<number, typeof challengesSorted>>((acc, c) => {
    (acc[c.year] ||= []).push(c);
    return acc;
  }, {});

  function copyToClipboard() {
    navigator.clipboard.writeText('npm run create-new-day');
  }

  return (
    <main className='main-menu'>
      <h1>Advent of Code</h1>
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
      <button onClick={copyToClipboard} className='small'>Create new day with: npm run create-new-day</button>
      <a href='https://adventofcode.com/' target="_blank" rel='noopener noreferrer' className='small'>Advent of Code</a>
    </main>
  );
}
