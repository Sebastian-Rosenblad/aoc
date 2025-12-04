export type Status = 'started' | 'silver' | 'gold' | 'other';

export type Meta = {
  year: number;
  day: number;
  status: Status;
  times?: Times;
};
export interface Times {
  one: number;
  two?: number;
}
export type Module = {
  default: React.ComponentType;
  meta: Meta;
};
