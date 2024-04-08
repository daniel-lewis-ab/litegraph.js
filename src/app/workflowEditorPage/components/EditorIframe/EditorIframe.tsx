/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react';
import { useWorkflowEditor } from '@/hooks/useWorkflowEditor/useWorkflowEditor';
import { GetWorkflowInputAssetsResponse, WebSocketMessage } from '@/api/types';
import { FullMessage, IframeToParentMessage } from './EditorIframe.types';
import { useWebSocket } from '@/hooks/useWebsocket/useWebsocket';
import { useWorkflowInputAssetsQuery } from '@/api/hooks/useWorkflowInputAssetsQuery/useWorkflowInputAssetsQuery';
import { useCreateWorkflowInputAssetMutation } from '@/api/hooks/useCreateWorkflowInputAssetMutation/useCreateWorkflowInputAssetMutation';
import { useParams } from 'react-router-dom';

export const EditorIframe = () => {
  const { id } = useParams();
  const { currentWorkflow, setCurrentWorkflow } = useWorkflowEditor();
  const { inputAssets } = useWorkflowInputAssetsQuery(id!);
  const { mutateAsync: createAssetAsync } = useCreateWorkflowInputAssetMutation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [state, setState] = useState<'init' | 'loaded'>('init');
  const { lastMessage, readyState } = useWebSocket();

  useEffect(() => {
    const handleWebsocketMessage = (message: WebSocketMessage | null) => {
      if (!message?.data) return;

      import.meta.env.VITE_SHOW_WEBSOCKET_LOGS === 'true' && console.log('websocket message', message);

      sendMessageToIframe({
        internal: message.data,
      });
    };

    handleWebsocketMessage(lastMessage);
  }, [lastMessage, readyState]);

  const sendMessageToIframe = (message: FullMessage) => {
    import.meta.env.VITE_SHOW_IFRAME_LOGS === 'true' && console.log('Sending message to iframe', message);
    iframeRef.current?.contentWindow?.postMessage(message, '*');
  };

  useEffect(() => {
    if (state === 'loaded' && currentWorkflow && currentWorkflow.updateSource === 'react') {
      sendMessageToIframe({
        internal: {
          type: 'load_prompt',
          data: {
            prompt: currentWorkflow.content,
            workflow_id: id,
          },
        },
      });

      sendMessageToIframe({
        internal: {
          type: 'refresh_defs',
          data: {
            inputs: (inputAssets as GetWorkflowInputAssetsResponse).results.map((asset) => asset.comfy_file_path),
          },
        },
      });
    }
  }, [state, currentWorkflow, inputAssets, id]);

  useEffect(() => {
    const handleMessageFromIframe = async (message: MessageEvent<IframeToParentMessage>) => {
      if (message.data.internal && message.data.internal.type === 'graph_data') {
        const newWorkflow = message.data.internal.data.content;
        const hasWorkflowBeenUpdated = JSON.stringify(currentWorkflow?.content) !== JSON.stringify(newWorkflow);

        if (hasWorkflowBeenUpdated) {
          import.meta.env.VITE_SHOW_IFRAME_LOGS === 'true' && console.log('Updating the content in react');
          setCurrentWorkflow({
            updateSource: 'iframe',
            content: newWorkflow,
            api_content: message.data.internal.data.api_content,
          });
        }
      }

      if (message.data.internal && message.data.internal.type === 'loaded') {
        setState('loaded');
      }

      if (message.data.internal && message.data.internal.type === 'upload') {
        console.log('uploading new asset', message.data.internal.data);
        const subdir = message.data.internal.data.subdir || 'editor';
        const file = message.data.internal.data.file;
        try {
          await createAssetAsync({
            workflow_id: id!,
            folder_path: subdir,
            workflow_asset_file: file,
          });
          sendMessageToIframe({ internal: { type: 'upload_done', data: { name: file.name } } });
        } catch (e) {
          sendMessageToIframe({ internal: { type: 'upload_rejected', data: { name: file.name, error: e } } });
        }
      }
    };

    window.addEventListener('message', handleMessageFromIframe);

    return () => {
      window.removeEventListener('message', handleMessageFromIframe);
    };
  }, [currentWorkflow?.content, setCurrentWorkflow, createAssetAsync, id]);

  return (
    <iframe
      ref={iframeRef}
      src={import.meta.env.VITE_IFRAME_URL}
      className="h-full w-full rounded-lg"
      title="Local HTML Content"
    />
  );
};
