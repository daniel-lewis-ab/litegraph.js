import { toast } from 'react-hot-toast';
import { Icon } from '@/shared/components/icon/Icon';
import { EmptyWorkflowsPage } from './components/EmptyWorkflowsPage';
import { WorkflowTile } from '@/shared/components/workflowTile/WorkflowTile';
import { faPlus } from '@awesome.me/kit-b6cda292ae/icons/sharp/solid';
import { faRectangleHistory, faUpload } from '@awesome.me/kit-b6cda292ae/icons/sharp/regular';
import { Input } from '@/shared/components/input/Input';
import { faMagnifyingGlass } from '@awesome.me/kit-b6cda292ae/icons/sharp/solid';
import { Workflow } from '@/api/types';
import { useState } from 'react';
import { DeleteConfirmationDialog } from './components/DeleteConfirmationDialog';
import { Link } from 'react-router-dom';
import { routes } from '@/routes/routes';

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
    <div className="flex w-full flex-col p-6">
      <div className="mb-6 flex flex-col *:mb-3 *:mr-4 md:flex-row md:*:mb-0">
        <Link
          className="border-border-muted flex flex-row items-center rounded-xl border px-3 py-2"
          to={routes.newWorkflow}
        >
          <Icon size={20} icon={faPlus} className="rounded-full bg-surface-100 p-[12px]" />
          <p className="ml-2 text-sm">New workflow</p>
        </Link>
        <button className="border-border-muted flex flex-row items-center rounded-xl border px-3 py-2">
          <Icon size={20} icon={faRectangleHistory} className="rounded-full bg-surface-100 p-[12px]" />
          <p className="ml-2 text-sm">Start from a template</p>
        </button>
        <button className="border-border-muted flex flex-row items-center rounded-xl border px-3 py-2">
          <Icon size={20} icon={faUpload} className="rounded-full bg-surface-100 p-[12px]" />
          <p className="ml-2 text-sm">Import</p>
        </button>
      </div>
      <div>
        <Input
          className="mb-6 max-w-sm"
          placeholder="Search this page..."
          leftIcon={<Icon icon={faMagnifyingGlass} />}
        />
      </div>
      <div className="grid grid-cols-1 content-start gap-4 md:grid-cols-3 lg:grid-cols-4">
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