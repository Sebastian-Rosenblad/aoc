import './styles.scss';
import { Link } from 'react-router-dom';
import { FiCopy, FiExternalLink, FiImage } from 'react-icons/fi';
import { ChallengeEntry, challengesSorted } from '../challenges';
import Stars from '../components/Stars';
import Times from '../components/Times';
import copyText from '../utils/copy-text';

export default function Home() {
  const groups = challengesSorted.reduce<Record<number, typeof challengesSorted>>((acc, c) => {
    (acc[c.year] ||= []).push(c);
    return acc;
  }, {});

  function getTotalStars(challenges: ChallengeEntry[]) {
    return challenges.reduce((total, c) => total + (c.status === 'gold' ? 2 : c.status === 'silver' ? 1 : 0), 0);
  }

  return (
    <main className='main-menu'>
      <div className='main-header'>
        <h1>Advent of Code</h1>
        <h2 className='quiet'>Solutions by Sebastian Rosenblad</h2>
      </div>
      <ul className='years-list'>
        {Object.entries(groups).map(([year, items]) => (
          <li key={year} className='year-list'>
            <h2>
              <a href={`https://adventofcode.com/${year}`} target='_blank' rel='noopener noreferrer'>[{year}]</a>
              <span className='quiet'> <Stars stars={['gold']} small />{getTotalStars(items)}/{year === '2025' ? 24 : 50}</span>
            </h2>
            <ul>
              {items.map((c) => (
                <li key={c.path}>
                  <span className='day-main'>
                    <Link to={c.path}>[Day {c.day.toString().padStart(2, '0')}]</Link>
                    <Stars status={c.status} small />
                    {c.visualization && <FiImage />}
                  </span>
                  {c.times && <p className='small'><Times times={c.times} /></p>}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <p className='small quiet'>Links:</p>
      <button onClick={() => copyText('npm run create-new-day')} className='small align-icon'><FiCopy /> [npm run create-new-day]</button>
      <a href='https://adventofcode.com/' target='_blank' rel='noopener noreferrer' className='small align-icon'><FiExternalLink /> Advent of Code</a>
    </main>
  );
}
