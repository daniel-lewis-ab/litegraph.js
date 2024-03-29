/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react';
import { useWorkflowEditor } from '@/hooks/useWorkflowEditor/useWorkflowEditor';
import { WebSocketMessage } from '@/api/types';
import { useWebsocket } from '@/hooks/useWebsocket/useWebsocket';
import { FullMessage, IframeToParentMessage } from './EditorIframe.types';

export const EditorIframe = () => {
  const { currentWorkflow, setCurrentWorkflow } = useWorkflowEditor();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [state, setState] = useState<'init' | 'loaded'>('init');
  const socket = useWebsocket();

  const sendMessageToIframe = (message: FullMessage) => {
    import.meta.env.VITE_SHOW_IFRAME_LOGS && console.log('Sending message to iframe', message);
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
    const handleMessageFromIframe = (message: MessageEvent<IframeToParentMessage>) => {
      if (message.data.internal && message.data.internal.type === 'graph_data') {
        const newWorkflow = message.data.internal.data.content;
        const hasWorkflowBeenUpdated = JSON.stringify(currentWorkflow?.content) !== JSON.stringify(newWorkflow);

        if (hasWorkflowBeenUpdated) {
          import.meta.env.VITE_SHOW_IFRAME_LOGS && console.log('Updating the content in react');
          setCurrentWorkflow({
            updateSource: 'iframe',
            content: newWorkflow,
            api_content: message.data.internal.data.api_content,
          });
        }
      }
    };

    window.addEventListener('message', handleMessageFromIframe);

    return () => {
      window.removeEventListener('message', handleMessageFromIframe);
    };
  }, [currentWorkflow?.content, setCurrentWorkflow]);

  useEffect(() => {
    const handleWebsocketMessage = (msg: MessageEvent<string>) => {
      const message: WebSocketMessage = JSON.parse(msg.data);
      import.meta.env.VITE_SHOW_WEBSOCKET_LOGS && console.log('websocket message', message);
      // @TODO: Filter out websocket messages to only send the ones that iframe needs + correctly type them
      sendMessageToIframe({
        internal: message.data,
      });
    };

    socket?.addEventListener('message', handleWebsocketMessage);

    return () => {
      socket?.removeEventListener('message', handleWebsocketMessage);
    };
  });

  return (
    <iframe
      ref={iframeRef}
      onLoad={() => setState('loaded')}
      src={import.meta.env.VITE_IFRAME_URL}
      className="h-full w-full rounded-lg"
      title="Local HTML Content"
    />
  );
};
