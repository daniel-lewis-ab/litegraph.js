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

type NodeInfo = {
  id: number;
  type: string;
  widgets_values?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

// TODO: Define this type more explicitly
export type WorkflowContent = {
  nodes: NodeInfo[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

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

export type ApiWorkflowInputAsset = {
  id: string;
  comfy_file_path: string;
  file_url: string;
};

export type ApiWorkflowOutputAsset = {
  id: string;
  name: string;
  asset_url: string;
  workflow_execution_id: string;
  created_at: string;
  size: number;
  storage_path: string;
};

export type ApiWorkflowOutputAssetDetails = ApiWorkflowOutputAsset & {
  content: WorkflowContent;
};

export type GetWorkflowOutputAssetsResponse = ApiWorkflowOutputAsset[];
export type GetWorkflowInputAssetsResponse = {
  // count: number;
  // next: string | null;
  // previous: string | null;
  results: ApiWorkflowInputAsset[];
};

// ============================
// Model imports
// ============================

export type MetadataResponse = {
  name: string;
  license: string;
};

export type MetadataResponseError = {
  error_code: 'INVALID_DOMAIN' | 'INVALID_URL' | 'INCOMPATIBLE_FILE_TYPE' | 'MODEL_PRIVATE';
};

type LoadingModel = { id: string; status: ModelImportStatus };

export type LoadingModelCreateResponse = LoadingModel;
export type LoadingModelCreateError = {
  error_code:
    | 'RESTRICTED_LICENSE'
    | 'INVALID_DOMAIN'
    | 'INVALID_URL'
    | 'INCOMPATIBLE_FILE_TYPE'
    | 'MODEL_PRIVATE'
    | 'MODEL_ALREADY_EXISTS'
    | 'MODEL_ALREADY_EXISTS_WITH_INACTIVE';
};

export type LoadingModelsResponse = LoadingModel[];

// ============================
// Websockets
// ============================

export type ExecutionFinishedData = {
  type: 'send_response';
  data: {
    completion_duration: number;
    execution_id: string;
    workflow_id: string;
    generated_artifacts: ApiWorkflowOutputAsset[];
    // JSON as string
    error?: string;
  };
};

export type ExecutionErrorData = {
  type: 'execution_error';
  data: {
    processing_metadata: string;
    error_message: string;
    execution_id: string;
    workflow_id: string;
  };
};

export type ExecutionStartData = {
  type: 'execution_start';
  data: {
    execution_id: string;
    workflow_id: string;
  };
};

export type PreviewExecutionData = {
  type: 'executed' | 'executing';
  data: {
    previews: { images: string[] };
    execution_id: string;
    workflow_id: string;
    node: number;
  };
};

export type WebSocketLoggingData = {
  type: 'salt.logging';
  data: LogData;
};

export type LogData = {
  message: string;
  logger_name: string;
  level: string;
  filename: string;
  module: string;
};

type ModelImportStatus = 'READY' | 'IMPORTING' | 'COMPLETED' | 'FAILED';

export type ModelImportFinishedData = {
  type: 'finished';
  id: string;
  status: ModelImportStatus;
  name: string;
};

type GeneralIframeMessageData = { data: object; type: string };

export type ParsedComfyUIExecutionError = {
  error: {
    type: string;
    message: string;
    details: string;
  };
  node_errors: [];
};

// @TODO
export type WebSocketMessage = {
  errors: object[];
  // We might want to define this more explicitly, but we just send it to iframe for now (it includes type and data - https://gitlab.com/plai-app/ai-studio/orchestra-backend/-/blob/develop/docs/socket_message.md?ref_type=heads)
  data:
    | GeneralIframeMessageData
    | ExecutionFinishedData
    | PreviewExecutionData
    | ExecutionStartData
    | ExecutionErrorData
    | WebSocketLoggingData
    | ModelImportFinishedData;
  action: 'artcraft_status' | 'send_response' | 'model_import_status';
  response_status: number;
};
