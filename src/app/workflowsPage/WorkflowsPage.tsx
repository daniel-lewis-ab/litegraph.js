import { Workflow } from '@/api/types';
import { PageActions } from '@/app/workflowsPage/components/PageActions';
import { routes } from '@/routes/routes';
import { WorkflowTile } from '@/shared/components/workflowTile/WorkflowTile';
import { faUpload } from '@awesome.me/kit-b6cda292ae/icons/sharp/regular';
import { faPlus } from '@awesome.me/kit-b6cda292ae/icons/sharp/solid';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { DeleteConfirmationDialog } from './components/DeleteConfirmationDialog';
import { EmptyWorkflowsPage } from './components/EmptyWorkflowsPage';
import { CreateDeploymentDialogContainer } from './components/createDeploymentDialog/CreateDeploymentDialogContainer';
import { PageTemplate } from '@/shared/components/pageTemplate/PageTemplate';

type WorkflowsPageProps = {
  workflows: Workflow[];
  onWorkflowDelete(id: string): Promise<void>;
};

export const WorkflowsPage = ({ workflows, onWorkflowDelete }: WorkflowsPageProps) => {
  const [workflowIdToDelete, setWorkflowIdToDelete] = useState<null | string>(null);
  const [workflowIdToDeploy, setWorkflowIdToDeploy] = useState<null | string>(null);

  if (workflows.length === 0) {
    return <EmptyWorkflowsPage />;
  }

  return (
    <PageTemplate>
      <PageTemplate.Header>
        <PageTemplate.Title>Workflows</PageTemplate.Title>
      </PageTemplate.Header>
      <PageActions>
        <PageActions.Action to={routes.newWorkflow} icon={faPlus} text="New workflow" />
        <PageActions.Action to={routes.newWorkflow} icon={faUpload} text="Import" />
      </PageActions>

      <div className="3xl:grid-cols-5 grid grid-cols-1 content-start gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {workflows.map((workflow) => (
          <WorkflowTile
            key={workflow.id}
            id={workflow.id}
            name={workflow.name}
            lastEdited={workflow.updated_at}
            onDeployClick={() => setWorkflowIdToDeploy(workflow.id)}
            onDeleteClick={() => setWorkflowIdToDelete(workflow.id)}
            onExportClick={() => toast('tbd')}
          />
        ))}
      </div>
      <DeleteConfirmationDialog
        isOpen={!!workflowIdToDelete}
        onClose={() => setWorkflowIdToDelete(null)}
        onConfirm={() => onWorkflowDelete(workflowIdToDelete!)}
      />
      <CreateDeploymentDialogContainer
        isOpen={!!workflowIdToDeploy}
        workflowId={workflowIdToDeploy!}
        onClose={() => setWorkflowIdToDeploy(null)}
        onSubmit={() => onWorkflowDelete(workflowIdToDelete!)}
      />
    </PageTemplate>
  );
};
