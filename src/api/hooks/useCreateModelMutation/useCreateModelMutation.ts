import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '@/api/axiosClient';
import { apiEndpoints } from '@/api/apiEndpoints';
import { QueryKeys } from '@/api/queryKeys';
import { LoadingModelCreateResponse, LoadingModelsResponse } from '@/api/types';

const createModel = async (url: string) => {
  const response = await axiosClient.post<LoadingModelCreateResponse>(apiEndpoints.importModel, { url });

  return response.data;
};

export const useCreateModelMutation = () => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: createModel,
    onSuccess: (newModel) => {
      queryClient.setQueryData<LoadingModelsResponse>(QueryKeys.loadingModels, (oldData) => {
        const newData: LoadingModelsResponse = [...(oldData ?? []), newModel];
        return newData;
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.loadingModels });
    },
  });

  return { mutate, ...rest };
};
