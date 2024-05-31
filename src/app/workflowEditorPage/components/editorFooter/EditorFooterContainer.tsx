import { useLoadingModelsQuery } from '@/api/hooks/useLoadingModelsQuery/useLoadingModelsQuery';
import { EditorFooter } from './EditorFooter';
import { useLoadingModelsWsUpdates } from '@/hooks/useLoadingModelsWsUpdates/useLoadingModelsWsUpdates';

export const EditorFooterContainer = () => {
  const { loadingModels } = useLoadingModelsQuery();
  useLoadingModelsWsUpdates();

  return <EditorFooter loadingModelsCount={loadingModels?.length ?? 0} />;
};
