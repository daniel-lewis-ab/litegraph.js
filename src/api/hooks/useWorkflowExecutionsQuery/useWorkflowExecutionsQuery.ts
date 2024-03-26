import { apiEndpoints } from '@/api/apiEndpoints';
import { QueryKeys } from '@/api/queryKeys';
import { axiosClient } from '@/api/axiosClient';
import { GetWorkflowExecutionsResponse } from '@/api/types'; // Assume this type is defined in your types file
import { useQuery } from '@tanstack/react-query';

// Function to fetch workflow executions, now accepting a workflowId
const getWorkflowExecutions = async (workflowId: string) => {
  const response = await axiosClient.get<GetWorkflowExecutionsResponse>(apiEndpoints.workflowExecutions(workflowId)); // Adjusted to include workflowId in the request

  if (response.status === 200) {
    return response.data;
  }

  throw new Error(`Failed to get workflow executions for workflow ID: ${workflowId}`);
};

// Custom hook to use the query for fetching workflow executions, now accepts workflowId as a parameter
export const useWorkflowExecutionsQuery = (workflowId: string) => {
  const { data, ...rest } = useQuery({
    queryKey: [QueryKeys.workflowExecutions, workflowId], // queryKey is now an array including workflowId
    queryFn: () => getWorkflowExecutions(workflowId),
    retry: 0,
    enabled: !!workflowId, // Only fetch when a workflowId is provided
  });

  return { workflowExecutions: data, ...rest };
};
