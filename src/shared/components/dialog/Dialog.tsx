import * as DialogPrimitive from '@radix-ui/react-dialog';
import { forwardRef } from 'react';
import clsx from 'clsx';

// Partially created by https://ui.shadcn.com/docs/components/dialog
export const Dialog = () => <></>;

Dialog.Root = DialogPrimitive.Root;

Dialog.Trigger = DialogPrimitive.Trigger;

Dialog.Portal = DialogPrimitive.Portal;

Dialog.Close = DialogPrimitive.Close;

Dialog.Overlay = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={clsx(
      'bg-background/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 backdrop-blur-lg',
      className,
    )}
    {...props}
  />
));
Dialog.Overlay.displayName = DialogPrimitive.Overlay.displayName;

Dialog.Content = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <Dialog.Portal>
    <Dialog.Overlay />
    <DialogPrimitive.Content
      ref={ref}
      className={clsx(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0  data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 flex min-w-[30%] max-w-lg translate-x-[-50%] translate-y-[-50%] flex-col bg-surface-2 p-6 shadow-lg duration-200 sm:rounded-xl',
        className,
      )}
      {...props}
    >
      {children}
      {/* <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none">
        CLOSE
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close> */}
    </DialogPrimitive.Content>
  </Dialog.Portal>
));
Dialog.Content.displayName = DialogPrimitive.Content.displayName;

// eslint-disable-next-line react/display-name
Dialog.Header = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx('mb-5 flex flex-col text-center', className)} {...props} />
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Dialog.Header as any).displayName = 'DialogHeader';

Dialog.Title = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={clsx('text-xl font-semibold text-text-base', className)} {...props} />
));

Dialog.Title.displayName = DialogPrimitive.Title.displayName;
