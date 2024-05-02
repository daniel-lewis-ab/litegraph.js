import { constants } from '@/contants';
import { faArrowUpRightFromSquare, faClose } from '@awesome.me/kit-b6cda292ae/icons/sharp/light';
import clsx from 'clsx';
import { ReactNode } from 'react';
import { Button } from '../button/Button';
import { Icon } from '../icon/Icon';

const Banner = ({
  children,
  className,
  onClickClose,
}: {
  children: ReactNode;
  className?: string;
  onClickClose?: () => void;
}) => (
  <div
    className={clsx(
      'flex content-center items-center justify-between gap-4 bg-secondary-1 p-1 px-3 py-2 text-center text-xs font-medium',
      className,
    )}
  >
    <div></div>
    <div className="flex content-center items-center gap-4">{children}</div>
    {onClickClose && (
      <button onClick={onClickClose}>
        <Icon icon={faClose} size={16} />
      </button>
    )}
  </div>
);

const PageBannerContent = () => (
  <>
    <div>Help us make Salt better by sharing feedback</div>
    <Button
      variant="filled"
      color="secondary"
      size="xs"
      onClick={() => window.open(constants.discordFeedbackUrl, '_blank')}
    >
      Feedback&nbsp; <Icon icon={faArrowUpRightFromSquare} size={12} />
    </Button>
  </>
);

const EditorBannerContent = () => (
  <>
    <div>Something missing? We currently supports 330 models and 140 node packs</div>
    <Button
      variant="filled"
      color="secondary"
      size="xs"
      onClick={() => window.open(constants.discordFeedbackUrl, '_blank')}
    >
      Make a request&nbsp; <Icon icon={faArrowUpRightFromSquare} size={12} />
    </Button>
  </>
);

export { Banner, EditorBannerContent, PageBannerContent };
