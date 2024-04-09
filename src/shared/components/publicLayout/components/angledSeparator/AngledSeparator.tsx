import { PublicContainer } from '../PublicContainer';
import s from './AngledSeparator.module.css';

export const AngledSeparator = () => (
  <PublicContainer>
    <hr className={s.separator} />
  </PublicContainer>
);
