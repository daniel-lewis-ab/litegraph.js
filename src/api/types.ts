export type PostLoginResponse = {
  access: string;
  refresh: string;
};

export type GetRefreshTokensResponse = {
  refresh: string;
  access: string;
};

export type Workflow = {
  id: string;
  name: string;
  updated_at: string;
};

export type WorkflowDetails = Workflow & {
  // Correctly define the content and api_content properties
  content: object;
  api_content: object;
};

export type GetWorkflowsResponse = {
  // links: { next: null; previous: null };
  count: number;
  results: Workflow[];
};

export type GetWorkflowResponse = WorkflowDetails;

export type DeploymentStatus = 'LOADING' | 'ONLINE' | 'PAUSED' | 'FAILED';

export type Deployment = {
  id: string;
  name: string;
  created_at: string;
  deployed_at?: string;
  status: DeploymentStatus;
  workflow_id: string;
};

export type DeploymentDetails = Deployment & {
  workflow_json: string;
  workflow_api_json: string;
};

export type GetDeploymentsResponse = {
  count?: number;
  results: Deployment[];
};

export type WorkflowStatus = 'loading' | 'error' | 'success';

export type WorkflowExecution = {
  id: string;
  operation_id: string;
  status: WorkflowStatus;
  workflow_id: string;
  completion_duration: number;
  // Added by me
  content: string;
};

export type GetWorkflowExecutionsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: WorkflowExecution[];
};

export type PostWorkflowExecutionsResponse = {
  id: string;
  operation_id: string;
  status: WorkflowStatus;
};
