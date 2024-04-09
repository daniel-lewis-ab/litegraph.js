import { PublicLayout } from '../publicLayout/PublicLayout';
import s from './AngledSeparator.module.css';

export const AngledSeparator = () => (
  <PublicLayout.Container>
    <hr className={s.separator} />
  </PublicLayout.Container>
);
