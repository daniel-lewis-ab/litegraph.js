import { Icon } from '@/shared/components/icon/Icon';
import { EmptyWorkflowsPage } from './components/EmptyWorkflowsPage';
import { WorkflowTile } from '@/shared/components/workflowTile/WorkflowTile';
import { faPlus } from '@awesome.me/kit-b6cda292ae/icons/sharp/solid';
import { faRectangleHistory, faUpload } from '@awesome.me/kit-b6cda292ae/icons/sharp/regular';
import { Input } from '@/shared/components/input/Input';
import { faMagnifyingGlass } from '@awesome.me/kit-b6cda292ae/icons/sharp/solid';

const baseWorkflows = [
  {
    id: '1',
    name: 'comfyui_Title01af___a',
    type: 'image',
    lastEdited: new Date().toISOString(), // Current timestamp
    nodesCount: 33,
  },
  {
    id: '2',
    name: 'comfyui_Title01af___a',
    type: 'controlnet',
    lastEdited: new Date(Date.now() - 3600 * 1000).toISOString(), // 1 hour ago
    nodesCount: 33,
  },
  {
    id: '3',
    name: '(Video Tutorial Resources) Picture in Picture Goodness + Canvas Pose',
    type: 'image',
    lastEdited: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // 1 day ago
    nodesCount: 33,
  },
  {
    id: '4',
    name: 'comfyui_Title01af___a',
    type: 'controlnet',
    lastEdited: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(), // 1 week ago
    nodesCount: 33,
    imageUrl: 'https://gcdnb.pbrd.co/images/aJIbNBtdViKg.png',
  },
];

const workflows = [
  ...baseWorkflows,
  ...baseWorkflows,
  ...baseWorkflows,
  ...baseWorkflows,
  ...baseWorkflows,
  ...baseWorkflows,
];

export const WorkflowsPage = () => {
  const isEmpty = false;

  if (isEmpty) {
    return <EmptyWorkflowsPage />;
  }

  return (
    <div className="flex w-full flex-col p-6">
      <div className="mb-6 flex flex-row *:mr-4">
        <button className="border-border-muted flex flex-row items-center rounded-xl border px-3 py-2">
          <Icon size={20} icon={faPlus} className="rounded-full bg-surface-100 p-[12px]" />
          <p className="ml-2 text-sm">New workflow</p>
        </button>
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
        {workflows.map((workflow, i) => (
          <WorkflowTile
            key={i}
            name={workflow.name}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            type={workflow.type as any}
            lastEdited={workflow.lastEdited}
            nodesCount={workflow.nodesCount}
            imageUrl={workflow.imageUrl}
            onActionClick={(action) => console.log('clicked', action)}
          />
        ))}
      </div>
    </div>
  );
};
