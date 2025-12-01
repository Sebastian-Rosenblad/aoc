import { Status } from '../challenges/types';

interface Props {
  status: Status;
}

export default function Stars({ status }: Props) {
  return <div className='stars'>
    <span className={status === 'silver' ? 'silver' : status === 'gold' ? 'gold' : ''}>*</span>
    <span className={status === 'gold' ? 'gold' : ''}>*</span>
  </div>;
}
