import { Meta, Status, Times } from './types';

const req = require.context('../challenges/years', true, /day\d+\.tsx$/);

export interface ChallengeEntry extends Meta {
  path: string;
  Component: React.ComponentType;
};

const extractYearDay = (key: string) => {
  const m = key.match(/\.\/(\d{4})\/day(\d{2})\.tsx$/i);
  if (!m) return null;
  const year = Number(m[1]);
  const day = Number(m[2]);
  return { year, day };
};

export const challenges: ChallengeEntry[] = req.keys().map((key: any) => {
  const mod = req(key) as { default: React.ComponentType; meta?: any };
  const ymd = extractYearDay(key);
  if (!ymd) throw new Error(`Invalid challenge filename: ${key}`);

  const meta = (mod.meta ?? {}) as {
    title?: string;
    status?: Status;
    times?: Times;
  };

  const path = `/${ymd.year}/day/${ymd.day}`;
  return {
    path,
    year: ymd.year,
    day: ymd.day,
    status: meta.status ?? 'started',
    times: meta.times,
    Component: mod.default,
  };
});

export const challengesSorted = [...challenges].sort((a, b) =>
  a.year === b.year ? a.day - b.day : a.year - b.year
);

export type { Status, Meta };
