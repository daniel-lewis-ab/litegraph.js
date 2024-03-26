// @TODO: Define proper types
import { WorkflowContent } from '@/api/types';
import { ReactNode, createContext, useState } from 'react';

type WorkflowContext = {
  currentWorkflow: WorkflowStateInfo | null;
  // @TODO: Update type
  setCurrentWorkflow(workflow: WorkflowStateInfo): void;
};

export const WorkflowEditorContext = createContext<WorkflowContext | undefined>(undefined);

type WorkflowEditorContextProviderProps = {
  children: ReactNode;
};

type WorkflowStateInfo = {
  content: WorkflowContent;
  updateSource: 'react' | 'iframe';
};

export const WorkflowEditorContextProvider = ({ children }: WorkflowEditorContextProviderProps) => {
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowStateInfo | null>(null);

  return (
    <WorkflowEditorContext.Provider value={{ currentWorkflow, setCurrentWorkflow }}>
      {children}
    </WorkflowEditorContext.Provider>
  );
};
