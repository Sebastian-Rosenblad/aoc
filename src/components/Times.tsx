import './Times.scss';
import { Times as TimesM } from "../challenges/types";

interface Props {
  times: TimesM;
}

export default function Times({ times }: Props) {
  function renderTime(seconds: number | undefined) {
    if (seconds === undefined) return '';
    let h: number | string = Math.floor(seconds / 3600);
    if (h >= 24) return '>= 1 day';
    h = h.toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  return (
    <>
      <span className='silver'>{renderTime(times.one)}</span> <span className='gold'>{renderTime(times.two)}</span>
    </>
  );
}
