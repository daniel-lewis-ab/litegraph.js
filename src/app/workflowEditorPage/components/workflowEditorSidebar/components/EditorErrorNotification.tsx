import { Icon } from '@/shared/components/icon/Icon';
import { faCircleExclamation, faClose } from '@awesome.me/kit-b6cda292ae/icons/sharp/regular';

export const EditorErrorNotification = ({
  onViewLogsClick,
  onCloseClick,
}: {
  onViewLogsClick(): void;
  onCloseClick(): void;
}) => (
  <div className="flex min-w-[380px] flex-row justify-between rounded-2xl bg-surface-2 p-4">
    <div className="flex flex-row">
      <div className="mr-3">
        <Icon icon={faCircleExclamation} className="*:text-error-9" size={20} />
      </div>
      <div>
        <p className="text-sm font-semibold">An error has occurred</p>
        <button className="text-sm underline" onClick={onViewLogsClick}>
          Review logs
        </button>
      </div>
    </div>
    <div>
      <button onClick={onCloseClick}>
        <Icon icon={faClose} size={16} className="*:text-surface-12 hover:opacity-90" />
      </button>
    </div>
  </div>
);
