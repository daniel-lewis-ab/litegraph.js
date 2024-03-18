import clsx from 'clsx';
import { toast } from 'react-hot-toast';
import { Icon } from '@/shared/components/icon/Icon';
import { faClone } from '@awesome.me/kit-b6cda292ae/icons/sharp/light';
import './CopyTextButton.scss';

export const CopyTextButton = ({
  text,
  className,
  showToastOnCopy = true,
}: {
  text: string;
  className?: string;
  showToastOnCopy?: boolean;
}) => {
  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        if (showToastOnCopy) {
          toast.success('Copied to clipboard');
        }
      })
      .catch(() => {
        if (showToastOnCopy) {
          toast.error('Failed to copy to clipboard');
        }
      });
  };

  return (
    <button
      className={clsx(
        'flex select-text flex-row items-center justify-between rounded-lg bg-surface-4 py-2.5 pl-3 pr-2 transition-all hover:opacity-90 active:opacity-80',
        className,
      )}
      onClick={handleCopyClick}
    >
      <div className="relative flex-1 overflow-hidden">
        <p className="truncate-shadow truncate text-left text-text-subtle">{text}</p>
      </div>
      <Icon icon={faClone} className="ml-2 *:text-icon-base" />
    </button>
  );
};
