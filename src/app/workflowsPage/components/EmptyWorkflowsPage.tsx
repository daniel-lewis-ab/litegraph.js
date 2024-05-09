import { routes } from '@/routes/routes';
import { Icon } from '@/shared/components/icon/Icon';
import { PageTemplate } from '@/shared/components/pageTemplate/PageTemplate';
import { faPlus, faSparkles } from '@awesome.me/kit-b6cda292ae/icons/classic/light';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export const EmptyWorkflowsPage = ({ banner }: { banner?: ReactNode }) => (
  <PageTemplate banner={banner}>
    <PageTemplate.Header>
      <PageTemplate.Title>Workflows</PageTemplate.Title>
    </PageTemplate.Header>
    <div className="flex h-full w-full items-center justify-center">
      <div className="-mt-12 *:mb-3 xl:w-[34%]">
        <Link
          className="group flex w-full flex-row items-center rounded-xl border border-border-muted px-6 py-4"
          to={routes.newWorkflow}
        >
          <Icon
            size={20}
            icon={faPlus}
            className="rounded-full bg-surface-3 p-4 transition-all group-hover:bg-surface-5"
          />
          <div className="flex flex-col items-start justify-start pl-2.5">
            <p className="font-medium">New workflow</p>
            <p className="font-light text-text-muted">Start with default workflow</p>
          </div>
        </Link>
        <Link
          className="group flex w-full flex-row items-center rounded-xl border border-border-muted px-6 py-4"
          to={routes.examples}
        >
          <Icon
            size={20}
            icon={faSparkles}
            className="rounded-full bg-surface-3 p-4 transition-all group-hover:bg-surface-5"
          />
          <div className="flex flex-col items-start justify-start pl-2.5">
            <p className="font-medium">Explore examples</p>
            <p className="font-light text-text-muted">Start from an example workflow</p>
          </div>
        </Link>
      </div>
    </div>
  </PageTemplate>
);
