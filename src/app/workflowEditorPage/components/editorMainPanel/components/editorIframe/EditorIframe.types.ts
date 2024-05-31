import { WebSocketMessage, WorkflowContent } from '@/api/types';

type GetPromptMessage = {
  internal: {
    type: 'get_prompt';
  };
};

type LoadPromptMessage = {
  internal: {
    type: 'load_prompt';
    data: {
      prompt: WorkflowContent;
    };
  };
};

// When FE fetch the inputs and models from the backend and update it in the ComfyUI iframe
type RefreshNodeDefinitionMessage = {
  internal: {
    type: 'refresh_defs';
    data: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      models: { string: any };
      inputs: string[];
    };
  };
};

// When we want to highlight specific node
type WebsocketToIframeMessage = {
  internal: WebSocketMessage['data'];
};

// @TODO: We can later remove internal from messages
export type FullMessage =
  | LoadPromptMessage
  | GetPromptMessage
  | RefreshNodeDefinitionMessage
  | WebsocketToIframeMessage;

// Send every X seconds by iframe with state of graph
export type IframeToParentGetGraphData = {
  type: 'graph_data';
  data: WorkflowContent;
};

// When user uploads new asset
export type IframeToParentUploadData = {
  type: 'upload';
  data: {
    file: File;
    subdir: string;
  };
};

// When user calling view endpoint
export type IframeToParentCallViewEndpoint = {
  type: 'view';
  data: {
    path: string;
  };
};

// When iframe is loaded and initialized
export type IframeToParentLoadedData = {
  type: 'loaded';
  data: WorkflowContent;
};

// When there are missing nodes in the workflow
export type IframeToParentMissingNodes = {
  type: 'missing_nodes';
  data: string[];
};

export type IframeToParentMessage = {
  internal:
    | IframeToParentGetGraphData
    | IframeToParentUploadData
    | IframeToParentLoadedData
    | IframeToParentCallViewEndpoint
    | IframeToParentMissingNodes;
};
