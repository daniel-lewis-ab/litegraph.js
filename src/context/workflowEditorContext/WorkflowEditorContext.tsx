// @TODO: Define proper types
import { WorkflowContent, WorkflowAPIContent } from '@/api/types';
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
  // Only iframe sends api_content
  api_content?: WorkflowAPIContent;
  // If update is coming from react, we don't want to send it to API, as iframe will send it back (it sends graph_data message every X ms)
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
