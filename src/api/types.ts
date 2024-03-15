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
  content: string;
};

export type GetWorkflowsResponse = {
  // links: { next: null; previous: null };
  count: number;
  results: Workflow[];
};

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
