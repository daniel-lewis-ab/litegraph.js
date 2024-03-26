// ============================
// Authentication Responses
// ============================

export type PostLoginResponse = {
  access: string;
  refresh: string;
};

export type GetRefreshTokensResponse = {
  refresh: string;
  access: string;
};

// ============================
// Workflows and Related Types
// ============================

export type Workflow = {
  id: string;
  name: string;
  updated_at: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WorkflowContent = any; // TODO: Define this type more explicitly

export type WorkflowDetails = Workflow & {
  content: WorkflowContent;
  api_content: WorkflowContent;
};

export type GetWorkflowResponse = WorkflowDetails;

export type GetWorkflowsResponse = {
  count: number;
  results: Workflow[];
};

// ============================
// Deployments
// ============================

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

// ============================
// Workflow Executions
// ============================

export type WorkflowStatus = 'loading' | 'error' | 'success';

export type WorkflowExecution = {
  id: string;
  operation_id: string;
  status: WorkflowStatus;
  workflow_id: string;
  completion_duration: number;
  // We add it in cache
  content?: WorkflowContent;
};

export type WorkflowExecutionDetails = WorkflowExecution & {
  content: WorkflowContent;
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

// ============================
// Workflow Assets
// ============================

export type ApiWorkflowAsset = {
  id: string;
  asset_url: string;
  workflow_execution_id: string;
  // created_at: string;
  // size: number;
};

export type ApiWorkflowAssetDetails = ApiWorkflowAsset & {
  content: WorkflowContent;
};

export type GetWorkflowAssetsResponse = {
  results: ApiWorkflowAsset[];
};
