import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import clsx from 'clsx';
import * as React from 'react';
import './Tooltip.scss';

const Tooltip = () => <></>;
Tooltip.Provider = TooltipPrimitive.Provider;

Tooltip.Root = TooltipPrimitive.Root;

Tooltip.Trigger = TooltipPrimitive.Trigger;

const Content = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & { className?: string; sideOffset?: number }
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={clsx(className, 'TooltipContent')}
    {...props}
  />
));

Content.displayName = TooltipPrimitive.Content.displayName;

Tooltip.Content = Content;

export default Tooltip;
