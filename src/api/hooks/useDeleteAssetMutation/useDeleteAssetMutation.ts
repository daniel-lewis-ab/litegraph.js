import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '@/api/axiosClient';
import { apiEndpoints } from '@/api/apiEndpoints';
import { QueryKeys } from '@/api/queryKeys';
import { GetWorkflowOutputAssetsResponse } from '@/api/types';

const deleteAsset = async ({ assetId, executionId }: { assetId: string; executionId: string; workflowId: string }) => {
  const response = await axiosClient.delete(apiEndpoints.asset({ assetId, executionId }));

  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (response.status !== 200) {
    throw new Error('Failed to delete asset');
  }

  return true;
};

export const useDeleteAssetMutation = () => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: deleteAsset,
    onSuccess: (_, { assetId, workflowId }) => {
      queryClient.setQueryData<GetWorkflowOutputAssetsResponse>(
        [QueryKeys.workflowOutputAssets, workflowId],
        (oldData) => {
          return oldData ? oldData.filter((asset) => asset.id !== assetId) : [];
        },
      );

      queryClient.invalidateQueries({ queryKey: [QueryKeys.workflowOutputAssets, workflowId] });
    },
  });

  return { mutate, ...rest };
};
