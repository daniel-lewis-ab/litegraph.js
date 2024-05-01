/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react';
import { useWorkflowEditor } from '@/hooks/useWorkflowEditor/useWorkflowEditor';
import { GetWorkflowInputAssetsResponse, PreviewExecutionData, WebSocketMessage } from '@/api/types';
import { FullMessage, IframeToParentMessage } from './EditorIframe.types';
import { useWebSocket } from '@/hooks/useWebsocket/useWebsocket';
import { useWorkflowInputAssetsQuery } from '@/api/hooks/useWorkflowInputAssetsQuery/useWorkflowInputAssetsQuery';
import { useCreateWorkflowInputAssetMutation } from '@/api/hooks/useCreateWorkflowInputAssetMutation/useCreateWorkflowInputAssetMutation';
import { useParams } from 'react-router-dom';
import { publicAxiosClient } from '@/api/axiosClient';

const getWorkflowPreviewAsset = async (url: string) => {
  const response = await publicAxiosClient.get(url, { responseType: 'blob' });

  if (response.status === 200) {
    return response.data;
  }
  throw new Error('Failed to get workflows preview assets');
};

export const EditorIframe = () => {
  const { id } = useParams();
  const { currentWorkflow, setCurrentWorkflow } = useWorkflowEditor();
  const { inputAssets, refetch: refetchInputAsset } = useWorkflowInputAssetsQuery(id!);
  const { mutateAsync: createAssetAsync } = useCreateWorkflowInputAssetMutation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [state, setState] = useState<'init' | 'loaded'>('init');
  const { lastMessage, readyState } = useWebSocket();

  const sendMessageToIframe = (message: FullMessage) => {
    import.meta.env.VITE_SHOW_IFRAME_LOGS === 'true' && console.log('Sending message to iframe', message);
    iframeRef.current?.contentWindow?.postMessage(message, '*');
  };

  useEffect(() => {
    const handleWebsocketMessage = async (message: WebSocketMessage | null) => {
      if (!message?.data) return;

      import.meta.env.VITE_SHOW_WEBSOCKET_LOGS === 'true' && console.log('websocket message', message);

      if (message.data.type == 'executed' || message.data.type == 'executing') {
        const previewData = message.data as PreviewExecutionData;
        if (previewData.data.previews) {
          try {
            const response = await getWorkflowPreviewAsset(previewData.data.previews.images[0]);
            sendMessageToIframe({
              internal: {
                type: message.data.type,
                data: {
                  previews: response,
                  execution_id: previewData.data.execution_id,
                  workflow_id: previewData.data.workflow_id,
                  node: previewData.data.node,
                },
              },
            });
          } catch (e) {
            console.error('Error:', e);
          }
        } else {
          sendMessageToIframe({
            internal: message.data,
          });
        }
      } else {
        sendMessageToIframe({
          internal: message.data,
        });
      }
    };

    handleWebsocketMessage(lastMessage);
  }, [lastMessage, readyState]);

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
    }
  }, [state, currentWorkflow, inputAssets, id]);

  useEffect(() => {
    if (state === 'loaded') {
      sendMessageToIframe({
        internal: {
          type: 'refresh_defs',
          data: {
            inputs:
              (inputAssets as GetWorkflowInputAssetsResponse)?.results.map((asset) => asset.comfy_file_path) ?? [],
          },
        },
      });
    }
  }, [state, inputAssets]);

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
        const subdir = message.data.internal.data.subdir;
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
        } finally {
          await refetchInputAsset();
        }
      }
    };

    window.addEventListener('message', handleMessageFromIframe);
    return () => {
      window.removeEventListener('message', handleMessageFromIframe);
    };
  }, [currentWorkflow?.content, setCurrentWorkflow, createAssetAsync, id, refetchInputAsset]);

  return (
    <iframe
      ref={iframeRef}
      src={import.meta.env.VITE_IFRAME_URL}
      className="h-full w-full rounded-lg"
      title="Local HTML Content"
    />
  );
};
