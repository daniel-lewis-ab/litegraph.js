/* eslint-disable no-console */
import { useEffect, useRef, useState, useContext } from 'react';
import { useWorkflowEditor } from '@/hooks/useWorkflowEditor/useWorkflowEditor';
import { WebSocketContext } from '@/context/websocketContext/WebSocketContext';
import { WorkflowContent } from '@/api/types';

type ExecutingMsg = {
  // When sending updates on the execution state
  type: 'executing';
  data: {
    node: number;
  };
};

type ExecutedMessage = {
  type: 'executed';
  data: {
    required_id: string;
  };
};

type GetPromptMessage = {
  internal: {
    type: 'get_prompt';
  };
};

type LoadPromptMessage = {
  // @TODO: Remove internal
  internal: {
    type: 'load_prompt';
    data: {
      prompt: WorkflowContent;
    };
  };
};

type FullMessage = LoadPromptMessage | ExecutingMsg | GetPromptMessage | ExecutedMessage;

// Send every X seconds by iframe with state of graph
type IframeToParentGetGraphData = {
  type: 'graph_data';
  data: WorkflowContent;
};

type IframeToParentMessage = {
  internal: IframeToParentGetGraphData;
};

export const EditorIframe = () => {
  const { currentWorkflow, setCurrentWorkflow } = useWorkflowEditor();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [state, setState] = useState<'init' | 'loaded'>('init');
  const socket = useContext(WebSocketContext);

  const sendMessageToIframe = (message: FullMessage) => {
    console.log('Sending message to iframe', message);
    iframeRef.current?.contentWindow?.postMessage(message, '*');
  };

  useEffect(() => {
    if (state === 'loaded' && currentWorkflow && currentWorkflow.updateSource === 'react') {
      sendMessageToIframe({
        internal: {
          type: 'load_prompt',
          data: {
            prompt: currentWorkflow.content,
          },
        },
      });
    }
  }, [state, currentWorkflow]);

  useEffect(() => {
    const handleMessage = (message: MessageEvent<IframeToParentMessage>) => {
      if (message.data.internal && message.data.internal.type === 'graph_data') {
        const newWorkflow = message.data.internal.data.content;
        const hasWorkflowBeenUpdated = JSON.stringify(currentWorkflow?.content) !== JSON.stringify(newWorkflow);
        if (hasWorkflowBeenUpdated) {
          console.log('Updating the content in react');
          setCurrentWorkflow({
            updateSource: 'iframe',
            content: newWorkflow,
            api_content: message.data.internal.data.api_content,
          });
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [currentWorkflow?.content, setCurrentWorkflow]);

  useEffect(() => {
    const onWebSocketMessage = (msg: MessageEvent) => {
      const data = JSON.parse(msg.data as string);
      sendMessageToIframe({ internal: data.data });
    };

    socket?.addEventListener('message', onWebSocketMessage);

    return () => {
      socket?.removeEventListener('message', onWebSocketMessage);
    };
  });

  return (
    <iframe
      ref={iframeRef}
      onLoad={() => setState('loaded')}
      src={import.meta.env.VITE_IFRAME_URL}
      className="h-full w-full rounded-lg"
      title="Local HTML Content"
    ></iframe>
  );
};
