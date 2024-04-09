import clsx from 'clsx';
import { ReactNode } from 'react';
import styles from './PublicContainer.module.scss';

export const PublicContainer = ({ children, className }: { children: ReactNode; className?: string }) => {
  return <div className={clsx(styles.publicContainer, className)}>{children}</div>;
};
