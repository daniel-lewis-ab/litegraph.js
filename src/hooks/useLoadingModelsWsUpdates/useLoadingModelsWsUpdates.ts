import { QueryKeys } from '@/api/queryKeys';
import { LoadingModelsResponse, ModelImportFinishedData } from '@/api/types';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useWebSocket } from '../useWebsocket/useWebsocket';
import toast from 'react-hot-toast';

export const useLoadingModelsWsUpdates = () => {
  const { lastMessage } = useWebSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!lastMessage) return;

    if (lastMessage.action === 'model_import_status') {
      const data = (lastMessage.data as ModelImportFinishedData).data;
      if (data.status === 'COMPLETED') {
        queryClient.invalidateQueries({ queryKey: QueryKeys.ownedModels });
        toast.success(`Model '${data.name}' has been successfully imported.`, { position: 'bottom-center' });
      } else if (data.status === 'FAILED') {
        toast.error(`Failed to import model '${data.name}'. Please try again.`, { position: 'bottom-center' });
      }

      if (data.status === 'COMPLETED' || data.status === 'FAILED') {
        queryClient.setQueryData<LoadingModelsResponse>(QueryKeys.loadingModels, (oldData) => {
          // @TODO: Update
          const newData: LoadingModelsResponse = (oldData ?? []).filter((model) => model.id !== data.id);
          return newData;
        });
        queryClient.invalidateQueries({ queryKey: QueryKeys.loadingModels });
      }
    }
  }, [lastMessage, queryClient]);
};
