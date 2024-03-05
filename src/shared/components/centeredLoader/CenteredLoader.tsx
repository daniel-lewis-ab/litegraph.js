import clsx from 'clsx';

type CenteredLoaderProps = {
  isFullscreen?: boolean;
};

const CenteredLoader = ({ isFullscreen }: CenteredLoaderProps) => {
  return (
    <div
      className={clsx(
        'flex h-full w-full items-center justify-center bg-surface bg-opacity-50',
        isFullscreen && 'min-h-screen',
      )}
    >
      <div className="border-white h-32 w-32 animate-spin rounded-full border-b-4 border-t-4"></div>
    </div>
  );
};

export default CenteredLoader;
