import { Status } from '../challenges/types';

interface Props {
  status: Status;
}

export default function Stars({ status }: Props) {
  return <section className='stars'>
    <div className={status === 'silver' ? 'silver star' : status === 'gold' ? 'gold star' : 'star'}>*</div>
    <div className={status === 'gold' ? 'gold star' : 'star'} style={{left: '16px'}}>*</div>
  </section>;
}
