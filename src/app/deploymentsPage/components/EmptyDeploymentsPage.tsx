import { constants } from '@/contants';
import { Icon } from '@/shared/components/icon/Icon';
import { faCircleInfo } from '@awesome.me/kit-b6cda292ae/icons/classic/regular';

export const EmptyDeploymentsPage = () => (
  <div>
    <div className="mb-4 flex flex-row rounded-lg bg-[#17171C] p-4">
      <Icon icon={faCircleInfo} size={16} className="mt-1 *:text-[#B1B1B1]" />
      <div className="ml-3">
        <p className="font-medium"> Start Deploying Workflows</p>
        <p className="mt-1 text-sm text-[#787883]">
          Craft and deploy your workflow. Explore our {/* @TODO: Update link */}
          <a href={constants.discordFlowCatalogueUrl} className="text-black underline">
            Discord flow catalogue
          </a>{' '}
          for technical insights and inspiration.
        </p>
      </div>
    </div>
    <div className="relative *:mb-4 ">
      <div
        className="absolute bottom-0 left-0 right-0 top-0 !mb-0"
        style={{ backgroundImage: 'linear-gradient(to bottom, rgba(7, 7, 10, 0.05), rgba(7, 7, 10, 1))' }}
      ></div>
      <div className="h-[110px] w-full rounded-lg bg-[#17171C]" />
      <div className="h-[110px] w-full rounded-lg bg-[#17171C]" />
      <div className="h-[110px] w-full rounded-lg bg-[#17171C]" />
      <div className="h-[110px] w-full rounded-lg bg-[#17171C]" />
      <div className="h-[110px] w-full rounded-lg bg-[#17171C]" />
    </div>
  </div>
);
