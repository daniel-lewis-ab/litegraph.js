import clsx from 'clsx';

type CenteredLoaderProps = {
  isFullscreen?: boolean;
};

export const CenteredLoader = ({ isFullscreen }: CenteredLoaderProps) => {
  return (
    <div
      className={clsx(
        'bg-surface flex h-full w-full items-center justify-center bg-opacity-50',
        isFullscreen && 'min-h-screen',
      )}
    >
      <div className="h-32 w-32 animate-spin rounded-full border-b-4 border-t-4 border-white"></div>
    </div>
  );
};
