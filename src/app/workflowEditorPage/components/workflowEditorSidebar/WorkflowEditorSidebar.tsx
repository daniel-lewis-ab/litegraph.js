import { ExecutionsSectionContainer } from './components/executionsSection/ExecutionsSectionContainer';
import { OutputsGalleryGridContainer } from './components/outputsGallerySection/OutputsGallerySectionContainer';

type WorkflowSidebarProps = {
  workflowId: string;
  workflowName: string;
  section: 'images' | 'executions' | null;
  onClose(): void;
};

export const WorkflowEditorSidebar = ({ workflowId, workflowName, section, onClose }: WorkflowSidebarProps) => (
  <div className="ml-1 h-full flex-1 rounded-lg bg-surface-2">
    {section === 'images' && (
      <OutputsGalleryGridContainer workflowName={workflowName} workflowId={workflowId} onClose={onClose} />
    )}
    {section === 'executions' && <ExecutionsSectionContainer workflowId={workflowId} onClose={onClose} />}
  </div>
);
