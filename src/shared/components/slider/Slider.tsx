'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import clsx from 'clsx';
import * as React from 'react';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & { className?: string }
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={clsx(
      'relative flex w-full touch-none select-none items-center',
      // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
      className as string,
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow cursor-pointer overflow-hidden rounded-full bg-surface-5">
      <SliderPrimitive.Range className="absolute h-full cursor-pointer bg-surface-11" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="focus-visible:ring-ring block h-4 w-4 cursor-pointer rounded-full border-2 border-surface-11 bg-surface-1 transition-colors hover:border-surface-12 hover:bg-surface-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
