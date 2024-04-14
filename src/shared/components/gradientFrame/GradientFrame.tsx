import { ReactNode } from 'react';
import './GradientFrame.scss';
import clsx from 'clsx';

export const GradientFrame = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={clsx('wrapper', className)}>
    <div className="gradientIframeBackground inset-0" />
    <div className="gradientIframe">{children}</div>
  </div>
);
