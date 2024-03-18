import { constants } from '@/contants';
import { Icon } from '@/shared/components/icon/Icon';
import { faCircleInfo } from '@awesome.me/kit-b6cda292ae/icons/classic/regular';
import './EmptyDeploymentsPage.scss';

export const EmptyDeploymentsPage = () => (
  <div>
    <div className="mb-4 flex flex-row rounded-lg bg-surface-2 p-4">
      <Icon icon={faCircleInfo} size={16} className="mt-1 *:text-[#B1B1B1]" />
      <div className="ml-3">
        <p className="font-medium"> Start Deploying Workflows</p>
        <p className="mt-1 text-sm text-[#787883]">
          Craft and deploy your workflow. Explore our {/* @TODO: Update link */}
          <a href={constants.discordFlowCatalogueUrl} className="text-black underline" target="_blank" rel="noreferrer">
            Discord flow catalogue
          </a>{' '}
          for technical insights and inspiration.
        </p>
      </div>
    </div>
    <div className="relative *:mb-4 ">
      <div className="wrapper-gradient absolute bottom-0 left-0 right-0 top-0 !mb-0"></div>
      <div className="h-[110px] w-full rounded-lg bg-surface-2" />
      <div className="h-[110px] w-full rounded-lg bg-surface-2" />
      <div className="h-[110px] w-full rounded-lg bg-surface-2" />
      <div className="h-[110px] w-full rounded-lg bg-surface-2" />
      <div className="h-[110px] w-full rounded-lg bg-surface-2" />
    </div>
  </div>
);
