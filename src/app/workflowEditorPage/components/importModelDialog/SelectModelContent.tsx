import { Dialog } from '@/shared/components/dialog/Dialog';
import { HuggingFaceIcon } from '@/shared/components/icons/HuggingFaceIcon';
import { ReactNode } from 'react';
import { Icon } from '@/shared/components/icon/Icon';
import { faAngleRight } from '@awesome.me/kit-b6cda292ae/icons/sharp/light';
import { constants } from '@/contants';
import civitaiLogo from './civitai-logo.png';
import { Model } from './ImportModelDialog';

const ImportButton = ({ icon, children, onClick }: { icon: ReactNode; children: ReactNode; onClick(): void }) => (
  <button
    className="mb-4 flex flex-row justify-between rounded-xl border border-border-base px-4 py-[10px] active:opacity-90"
    onClick={onClick}
  >
    <div className="flex flex-row items-center justify-center">
      <div>{icon}</div>
      <p className="ml-2">{children}</p>
    </div>
    <Icon icon={faAngleRight} size={24} />
  </button>
);

export const SelectModelContent = ({ onSelectModel }: { onSelectModel(model: Model): void }) => (
  <>
    <Dialog.Header>
      <Dialog.Title>Import model</Dialog.Title>
    </Dialog.Header>
    <div className="flex flex-col">
      <ImportButton icon={<HuggingFaceIcon />} onClick={() => onSelectModel('HuggingFace')}>
        Hugging Face
      </ImportButton>
      <ImportButton
        icon={<img src={civitaiLogo} className="h-[20px] w-[20px]" />}
        onClick={() => onSelectModel('Civitai')}
      >
        Civitai
      </ImportButton>
      <div className="rounded-lg bg-surface-3 px-4 py-[10px] text-xs text-text-subtle">
        At this time, models imported to Salt are publicly available to all Salt users and can be removed by request in{' '}
        <a href={constants.discordFeedbackUrl} target="_blank" rel="noreferrer" className="underline">
          Discord
        </a>
      </div>
    </div>
  </>
);
