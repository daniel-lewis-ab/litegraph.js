import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '@/api/axiosClient';
import { apiEndpoints } from '@/api/apiEndpoints';
import { QueryKeys } from '@/api/queryKeys';
import { GetWorkflowInputAssetsResponse, ApiWorkflowInputAsset } from '@/api/types';

type CreateWorkflowInputAssetRequest = {
  workflow_id: string;
  folder_path: string;
  workflow_asset_file: File;
};

const createWorkflowInputAsset = async (request: CreateWorkflowInputAssetRequest): Promise<ApiWorkflowInputAsset> => {
  const formData = new FormData();
  formData.append('folder_path', request.folder_path);
  formData.append('workflow_asset_file', request.workflow_asset_file);

  const response = await axiosClient.post<ApiWorkflowInputAsset>(
    apiEndpoints.workflowInputAssets(request.workflow_id),
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  if (response.status !== 202) {
    throw new Error('Failed to upload workflow input asset');
  }

  return response.data;
};

export const useCreateWorkflowInputAssetMutation = () => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation<ApiWorkflowInputAsset, Error, CreateWorkflowInputAssetRequest>({
    mutationFn: createWorkflowInputAsset,
    onSuccess: async (newWorkflowInputAsset) => {
      queryClient.setQueryData<GetWorkflowInputAssetsResponse>(QueryKeys.workflowInputAssets, (oldData) => {
        const oldWorkflowInputAssets = oldData?.results ?? [];
        const newData = {
          results: [newWorkflowInputAsset, ...oldWorkflowInputAssets],
        };

        return newData;
      });

      await queryClient.invalidateQueries({ queryKey: QueryKeys.workflowInputAssets });
    },
  });

  return { mutate, ...rest };
};
