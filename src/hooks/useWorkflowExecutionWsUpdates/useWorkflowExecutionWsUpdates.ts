/* eslint-disable no-console */
import {
  ApiWorkflowOutputAsset,
  ExecutionFinishedData,
  GetWorkflowOutputAssetsResponse,
  GetWorkflowExecutionsResponse,
  WebSocketMessage,
  ExecutionStartData,
} from '@/api/types';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/api/queryKeys';
import toast from 'react-hot-toast';
import { useWebSocket } from '@/hooks/useWebsocket/useWebsocket';

export const useWorkflowExecutionWsUpdates = () => {
  const { lastMessage } = useWebSocket();
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
      completionDuration?: number;
      status: 'COMPLETED' | 'FAILED' | 'RUNNING';
    }) => {
      const currentData = queryClient.getQueryData<GetWorkflowExecutionsResponse>([
        QueryKeys.workflowExecutions,
        workflowId,
      ]);

      if (currentData) {
        const updatedResults = currentData.results.map((execution) => {
          if (execution.id === executionId) {
            return { ...execution, status, ...(completionDuration ? { completion_duration: completionDuration } : {}) };
          }
          return execution;
        });

        queryClient.setQueryData([QueryKeys.workflowExecutions, workflowId], {
          ...currentData,
          results: updatedResults,
        });
      }
    };

    const updateWorkflowAssetsWithNewArtifacts = (workflowId: string, newArtifacts: ApiWorkflowOutputAsset[] = []) => {
      const currentData =
        queryClient.getQueryData<GetWorkflowOutputAssetsResponse>([QueryKeys.workflowOutputAssets, workflowId]) ?? [];

      const updatedAssets = [...newArtifacts, ...currentData];
      queryClient.setQueryData([QueryKeys.workflowOutputAssets, workflowId], updatedAssets);
    };

    const handleWebsocketMessage = (message: WebSocketMessage | null) => {
      if (!message?.data) return;

      if (message.data.type === 'execution_start') {
        const data = (message.data as ExecutionStartData).data;

        updateExecutionStatus({
          workflowId: data.workflow_id,
          executionId: data.execution_id,
          status: 'RUNNING',
        });
      }

      if (message.data.type === 'send_response') {
        const data = (message.data as ExecutionFinishedData).data;

        if (data.error?.length) {
          console.error('Workflow job failed, details:', data.error);

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

    handleWebsocketMessage(lastMessage);
  }, [lastMessage, queryClient]);
};
