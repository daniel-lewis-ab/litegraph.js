/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react';
import { useWorkflowEditor } from '@/hooks/useWorkflowEditor/useWorkflowEditor';
import { WorkflowContent } from '@/context/workflowEditorContext/WorkflowEditorContext';

type LoadPromptMessage = {
  // @TODO: Remove internal
  internal: {
    type: 'load_prompt';
    data: {
      prompt: WorkflowContent;
    };
  };
};

type FullMessage = LoadPromptMessage;

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

  const sendMessageToIframe = (message: FullMessage) => {
    console.log('Sending message to iframe', message.internal.type, message);
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
      if (message.data.internal.type === 'graph_data') {
        const newWorkflow = message.data.internal.data;
        const hasWorkflowBeenUpdated = JSON.stringify(currentWorkflow?.content) !== JSON.stringify(newWorkflow);
        if (hasWorkflowBeenUpdated) {
          console.log('Updating the content in react');
          setCurrentWorkflow({ updateSource: 'iframe', content: newWorkflow });
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [currentWorkflow?.content, setCurrentWorkflow]);

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
