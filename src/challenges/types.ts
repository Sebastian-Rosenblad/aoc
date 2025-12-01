export type Status = 'started' | 'silver' | 'gold';

export type Meta = {
  year: number;
  day: number;
  status: Status;
};
export type Module = {
  default: React.ComponentType;
  meta: Meta;
};
