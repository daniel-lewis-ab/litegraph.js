import {
  ApiWorkflowAsset,
  ExecutionFinishedData,
  GetWorkflowAssetsResponse,
  GetWorkflowExecutionsResponse,
  WebSocketMessage,
} from '@/api/types';
import { useWebsocket } from '../useWebsocket/useWebsocket';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/api/queryKeys';
import toast from 'react-hot-toast';

export const useUpdateWorkflowFromWebsocket = () => {
  const socket = useWebsocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    const updateExecutionStatus = ({
      workflowId,
      executionId,
      completionDuration,
      status,
    }: {
      workflowId: string;
      executionId: string;
      completionDuration: number;
      status: 'COMPLETED' | 'FAILED';
    }) => {
      const currentData = queryClient.getQueryData<GetWorkflowExecutionsResponse>([
        QueryKeys.workflowExecutions,
        workflowId,
      ]);

      if (currentData) {
        const updatedResults = currentData.results.map((execution) => {
          if (execution.id === executionId) {
            return { ...execution, status, completion_duration: completionDuration };
          }
          return execution;
        });

        queryClient.setQueryData([QueryKeys.workflowExecutions, workflowId], {
          ...currentData,
          results: updatedResults,
        });
      }
    };

    const updateWorkflowAssetsWithNewArtifacts = (workflowId: string, newArtifacts: ApiWorkflowAsset[] = []) => {
      const currentData =
        queryClient.getQueryData<GetWorkflowAssetsResponse>([QueryKeys.workflowAssets, workflowId]) ?? [];

      const updatedAssets = [...newArtifacts, ...currentData];
      queryClient.setQueryData([QueryKeys.workflowAssets, workflowId], updatedAssets);
    };

    const handleWebsocketMessage = (msg: MessageEvent<string>) => {
      const message: WebSocketMessage = JSON.parse(msg.data);
      if (message.data.type === 'send_response') {
        const data = (message.data as ExecutionFinishedData).data;
        if (data.error?.length) {
          toast.error('Workflow execution failed', { position: 'bottom-center' });
          updateExecutionStatus({
            workflowId: data.workflow_id,
            executionId: data.execution_id,
            completionDuration: data.completion_duration,
            status: 'FAILED',
          });

          return;
        }

        updateExecutionStatus({
          workflowId: data.workflow_id,
          executionId: data.execution_id,
          completionDuration: data.completion_duration,
          status: 'COMPLETED',
        });
        updateWorkflowAssetsWithNewArtifacts(data.workflow_id, data.generated_artifacts);
        toast.success('Workflow execution completed', { position: 'bottom-center' });
      }
    };

    socket?.addEventListener('message', handleWebsocketMessage);

    return () => {
      socket?.removeEventListener('message', handleWebsocketMessage);
    };
  }, [socket, queryClient]);
};
