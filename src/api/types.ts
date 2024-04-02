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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WorkflowAPIContent = any; // TODO: Define this type more explicitly

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

export type WorkflowStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export type WorkflowExecution = {
  id: string;
  operation_id: string;
  status: WorkflowStatus;
  workflow_id: string;
  completion_duration?: number;
  created_at: string;
};

export type WorkflowExecutionDetails = WorkflowExecution & {
  workflow_content: WorkflowContent;
  workflow_api_content: WorkflowContent;
};

export type GetWorkflowExecutionsResponse = {
  count: number;
  // next: string | null;
  // previous: string | null;
  results: WorkflowExecution[];
};

export type PostWorkflowExecutionsResponse = {
  id: string;
  operation_id: string;
  status: WorkflowStatus;
  created_at: string;
};

// ============================
// Workflow Assets
// ============================

export type ApiWorkflowAsset = {
  id: string;
  name: string;
  asset_url: string;
  workflow_execution_id: string;
  created_at: string;
  size: number;
  storage_path: string;
};

export type ApiWorkflowAssetDetails = ApiWorkflowAsset & {
  content: WorkflowContent;
};

export type GetWorkflowAssetsResponse = ApiWorkflowAsset[];

// ============================
// Websockets
// ============================

export type ExecutionFinishedData = {
  type: 'send_response';
  data: {
    completion_duration: number;
    execution_id: string;
    workflow_id: string;
    generated_artifacts: ApiWorkflowAsset[];
    // JSON as string
    error?: string;
  };
};

type GeneralIframeMessageData = { data: object; type: string };

// @TODO
export type WebSocketMessage = {
  errors: object[];
  // We might want to define this more explicitly, but we just send it to iframe for now (it includes type and data - https://gitlab.com/plai-app/ai-studio/orchestra-backend/-/blob/develop/docs/socket_message.md?ref_type=heads)
  data: GeneralIframeMessageData | ExecutionFinishedData;
  action: 'artcraft_status' | 'send_response';
  response_status: number;
};
