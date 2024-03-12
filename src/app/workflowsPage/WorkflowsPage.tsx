import { Workflow } from '@/api/types';
import { PageActions } from '@/app/workflowsPage/components/PageActions';
import { routes } from '@/routes/routes';
import { Icon } from '@/shared/components/icon/Icon';
import { WorkflowTile } from '@/shared/components/workflowTile/WorkflowTile';
import { faArrowUpRightFromSquare, faUpload } from '@awesome.me/kit-b6cda292ae/icons/sharp/regular';
import { faPlus } from '@awesome.me/kit-b6cda292ae/icons/sharp/solid';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { DeleteConfirmationDialog } from './components/DeleteConfirmationDialog';
import { EmptyWorkflowsPage } from './components/EmptyWorkflowsPage';

type WorkflowsPageProps = {
  workflows: Workflow[];
  onWorkflowDelete(id: string): Promise<void>;
};

export const WorkflowsPage = ({ workflows, onWorkflowDelete }: WorkflowsPageProps) => {
  const [workflowIdToDelete, setWorkflowIdToDelete] = useState<null | string>(null);

  if (workflows.length === 0) {
    return <EmptyWorkflowsPage />;
  }

  return (
    <div className="flex w-full flex-col px-3 lg:px-16">
      <div className="mb-16 mt-8 space-y-6">
        <div className="flex items-center space-x-3">
          <span className=" inline rounded-lg bg-surface-5 px-2 py-1 text-sm font-medium">Beta</span>
          <a
            href="/"
            className="rounded-lg bg-amber-5 px-2 py-1 text-sm font-medium text-on-warning *:text-amber-12 dark:border-amber-12 dark:bg-amberA-5 dark:text-amber-5 dark:*:text-amber-5 dark:hover:bg-amberA-8"
          >
            Feedback&nbsp; <Icon icon={faArrowUpRightFromSquare} size={12} />
          </a>
        </div>
        <h1 className="inline-block text-5xl font-medium">Workflows</h1>
      </div>
      <PageActions>
        <PageActions.Action to={routes.newWorkflow} icon={faPlus} text="New workflow" />
        <PageActions.Action to={routes.newWorkflow} icon={faUpload} text="Import" />
      </PageActions>

      <div className="grid grid-cols-1 content-start gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {workflows.map((workflow) => (
          <WorkflowTile
            key={workflow.id}
            id={workflow.id}
            name={workflow.name}
            lastEdited={workflow.updated_at}
            onActionClick={(action) => {
              if (action === 'delete') {
                setWorkflowIdToDelete(workflow.id);
              } else {
                toast(`${action} TBD`);
              }
              return Promise.resolve();
            }}
          />
        ))}
      </div>
      <DeleteConfirmationDialog
        isOpen={!!workflowIdToDelete}
        onClose={() => setWorkflowIdToDelete(null)}
        onConfirm={() => onWorkflowDelete(workflowIdToDelete!)}
      />
    </div>
  );
};
