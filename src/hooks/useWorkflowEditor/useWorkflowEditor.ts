import { WorkflowEditorContext } from '@/context/workflowEditorContext/WorkflowEditorContext';
import { useContext } from 'react';

export const useWorkflowEditor = () => {
  const context = useContext(WorkflowEditorContext);

  if (!context) {
    throw new Error('useWorkflowEditor must be used within an WorkflowEditorContext');
  }

  return context;
};
