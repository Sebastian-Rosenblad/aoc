import './Stars.scss';
import { Status } from '../challenges/types';

interface Props {
  status?: Status;
  stars?: Status[];
  small?: boolean;
}

export default function Stars({ status, stars, small }: Props) {
  function getStarClass(s: Status, onlyGold?: boolean) {
    if (!onlyGold && s === 'silver') return 'silver star';
    if (s === 'gold') return 'gold star';
    return 'star';
  }

  if (status !== undefined) return (
    <section className={'stars' + (small ? ' small' : '')}>
      <div className={getStarClass(status)}>*</div>
      <div className={getStarClass(status, true)}>*</div>
    </section>
  );
  return (
    <section className={'stars' + (small ? ' small' : '')}>
      {stars?.map((s, i) => (
        <div key={i} className={getStarClass(s)}>*</div>
      ))}
    </section>
  );
}
