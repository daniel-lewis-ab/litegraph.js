import { Icon } from '@/shared/components/icon/Icon';
import { faPlus, faRectangleHistory, faFileImport } from '@awesome.me/kit-b6cda292ae/icons/sharp/solid';

export const EmptyWorkflowsPage = () => (
  <div className="flex w-full items-center justify-center">
    <div className="w-[34%] *:mb-3">
      <button className="border-border-default flex w-full flex-row items-center rounded-3xl border px-6 py-4">
        <Icon size={20} icon={faPlus} className="rounded-full bg-surface-100 p-[12px]" />
        <div className="flex flex-col items-start justify-start pl-2.5">
          <p className="font-bold">New Workflow</p>
          <p className="text-foreground-muted font-light">Start with an empty project</p>
        </div>
      </button>
      <button className="border-border-default flex w-full flex-row items-center rounded-3xl border px-6 py-4">
        <Icon size={20} icon={faRectangleHistory} className="rounded-full bg-surface-100 p-[12px]" />
        <div className="flex flex-col items-start justify-start pl-2.5">
          <p className="font-bold">From Template</p>
          <p className="text-foreground-muted font-light">Explore powerful templates</p>
        </div>
      </button>
      <button className="border-border-default !mb-0 flex w-full flex-row items-center rounded-3xl border px-6 py-4">
        <Icon size={20} icon={faFileImport} className="rounded-full bg-surface-100 p-[12px]" />
        <div className="flex flex-col items-start justify-start pl-2.5">
          <p className="font-bold">Import</p>
          <p className="text-foreground-muted font-light">Import JSON</p>
        </div>
      </button>
    </div>
  </div>
);
