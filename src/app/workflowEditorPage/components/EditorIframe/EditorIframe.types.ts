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

// When we want to highlight specific node
type WebsocketToIframeMessage = {
  internal: WebSocketMessage['data'];
};

// @TODO: We can later remove internal from messages
export type FullMessage = LoadPromptMessage | GetPromptMessage | WebsocketToIframeMessage;

// Send every X seconds by iframe with state of graph
export type IframeToParentGetGraphData = {
  type: 'graph_data';
  data: WorkflowContent;
};

export type IframeToParentMessage = {
  internal: IframeToParentGetGraphData;
};
