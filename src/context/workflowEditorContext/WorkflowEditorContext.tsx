// @TODO: Define proper types
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

// @TODO: Update type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WorkflowContent = any;

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
