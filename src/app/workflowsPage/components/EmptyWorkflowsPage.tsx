import { routes } from '@/routes/routes';
import { Icon } from '@/shared/components/icon/Icon';
import { faPlus } from '@awesome.me/kit-b6cda292ae/icons/sharp/solid';
import { Link } from 'react-router-dom';

export const EmptyWorkflowsPage = () => (
  <div className="flex w-full items-center justify-center">
    <div className="w-[34%] *:mb-3">
      <Link
        className="group flex w-full flex-row items-center rounded-3xl border border-border-default px-6 py-4"
        to={routes.newWorkflow}
      >
        <Icon size={20} icon={faPlus} className="rounded-full bg-surface-3 p-[12px] group-hover:bg-surface-5" />
        <div className="flex flex-col items-start justify-start pl-2.5">
          <p className="font-bold">New Workflow</p>
          <p className="font-light text-foreground-muted">Start with an empty project</p>
        </div>
      </Link>
      {/* <button className="group flex w-full flex-row items-center rounded-3xl border border-border-default px-6 py-4">
        <Icon
          size={20}
          icon={faRectangleHistory}
          className="rounded-full bg-surface-3 p-[12px] group-hover:bg-surface-5"
        />
        <div className="flex flex-col items-start justify-start pl-2.5">
          <p className="font-bold">From Template</p>
          <p className="font-light text-foreground-muted">Explore powerful templates</p>
        </div>
      </button> */}
      {/* <button className="!mb-0 flex w-full flex-row items-center rounded-3xl border border-border-default px-6 py-4">
        <Icon size={20} icon={faFileImport} className="bg-surface-100 rounded-full p-[12px]" />
        <div className="flex flex-col items-start justify-start pl-2.5">
          <p className="font-bold">Import</p>
          <p className="font-light text-foreground-muted">Import JSON</p>
        </div>
      </button> */}
    </div>
  </div>
);
