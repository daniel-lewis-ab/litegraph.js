import { Icon } from '@/shared/components/icon/Icon';
import { faPlus } from '@awesome.me/kit-b6cda292ae/icons/sharp/solid';

export const DashboardPage = () => (
  <div className="flex w-full items-center justify-center">
    <div className="w-[40%] *:mb-5">
      <button className="flex w-full flex-row items-center rounded-2xl border border-[#313155] p-4">
        <Icon size={20} icon={faPlus} className="rounded-full bg-surface-100 p-[20px]" />
        <div className="flex flex-col items-start justify-start pl-2.5">
          <p className="font-bold">New Workflow</p>
          {/* @TODO: Change to inter */}
          <p className="text-[#9F9FC5]">Start with an empty project</p>
        </div>
      </button>
      <button className="flex w-full flex-row items-center rounded-2xl border border-[#313155] p-4">
        <Icon size={20} icon={faPlus} className="rounded-full bg-surface-100 p-[20px]" />
        <div className="flex flex-col items-start justify-start pl-2.5">
          <p className="font-bold">From Template</p>
          {/* @TODO: Change to inter */}
          <p className="text-[#9F9FC5]">Explore powerful templates</p>
        </div>
      </button>
      <button className="!mb-0 flex w-full flex-row items-center rounded-2xl border border-[#313155] p-4">
        <Icon size={20} icon={faPlus} className="rounded-full bg-surface-100 p-[20px]" />
        <div className="flex flex-col items-start justify-start pl-2.5">
          <p className="font-bold">Import</p>
          {/* @TODO: Change to inter */}
          <p className="text-[#9F9FC5]">Upload JSON</p>
        </div>
      </button>
    </div>
  </div>
);
