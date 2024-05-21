import { useDeleteAssetMutation } from '@/api/hooks/useDeleteAssetMutation/useDeleteAssetMutation';
import { useFetchExecutionDetailsQuery } from '@/api/hooks/useWorkflowExecutionDetailsQuery/useWorkflowExecutionDetailsQuery';
import { useWorkflowOutputAssetsQuery } from '@/api/hooks/useWorkflowOutputAssetsQuery/useWorkflowOutputAssetsQuery';
import { CenteredLoader } from '@/shared/components/centeredLoader/CenteredLoader';
import { getImageUrl } from '@/shared/functions/getImageUrl';
import { saveImage } from '@/shared/functions/saveImage';
import { faImages } from '@awesome.me/kit-b6cda292ae/icons/classic/solid';
import toast from 'react-hot-toast';
import { EditorSection } from '../EditorSection';
import { OutputsGallerySection } from './OutputsGallerySection';

type OutputsGalleryGridContainerProps = {
  workflowId: string;
  workflowName: string;
  onClose(): void;
};

export const OutputsGalleryGridContainer = ({
  workflowId,
  workflowName,
  onClose,
}: OutputsGalleryGridContainerProps) => {
  const { prefetchExecutionDetails, fetchExecutionDetails } = useFetchExecutionDetailsQuery();
  const { assets, isLoading, isError } = useWorkflowOutputAssetsQuery(workflowId);
  const { mutateAsync: deleteAsset } = useDeleteAssetMutation();

  const handleDeleteAsset = async ({ assetId, executionId }: { assetId: string; executionId: string }) => {
    try {
      const res = await deleteAsset({ assetId, executionId, workflowId });
      toast.success('Output deleted', { position: 'bottom-center' });
      return res;
    } catch (error) {
      toast.error('Failed to delete output', { position: 'bottom-center' });
      return false;
    }
  };

  const onCopyAssetContent = async (assetId: string) => {
    const executionId = assets!.find((a) => a.id === assetId)!.workflow_execution_id;

    try {
      const res = await fetchExecutionDetails(executionId);
      await navigator.clipboard.writeText(JSON.stringify(res.workflow_content));

      toast.success('Copied JSON to clipboard', { position: 'bottom-center' });
    } catch (error) {
      toast.error('Failed to copy JSON to clipboard', { position: 'bottom-center' });
    }
  };

  const handlePrefetchAssetInfo = (assetId: string) => {
    const executionId = assets!.find((a) => a.id === assetId)!.workflow_execution_id;
    prefetchExecutionDetails(executionId);
  };

  const handleDownloadAsset = async (assetId: string) => {
    try {
      const asset = assets!.find((a) => a.id === assetId)!;
      const imgUrl = getImageUrl(asset.storage_path);
      const timeString = new Date(asset.created_at).toLocaleTimeString();
      const dateString = new Date(asset.created_at).toLocaleDateString();
      const fileName = `${workflowName} - ${dateString} ${timeString}`;

      await saveImage(imgUrl, fileName);
      toast.success('Asset downloaded', { position: 'bottom-center' });
    } catch (error) {
      toast.error('Failed to download asset', { position: 'bottom-center' });
    }
  };

  const handleOpenAsset = (assetId: string) => {
    const asset = assets!.find((a) => a.id === assetId)!;
    open(getImageUrl(asset.storage_path), '_blank');
  };

  if (isLoading) {
    return (
      <EditorSection icon={faImages} title="Outputs" onClose={onClose}>
        <CenteredLoader isFullscreen />
      </EditorSection>
    );
  }

  if (isError) {
    return (
      <EditorSection icon={faImages} title="Outputs" onClose={onClose}>
        <p>Error occurred</p>
      </EditorSection>
    );
  }

  return (
    <OutputsGallerySection
      assets={assets ?? []}
      onClose={onClose}
      onDownloadAsset={handleDownloadAsset}
      onCopyAssetContent={onCopyAssetContent}
      onDeleteOutputAsset={handleDeleteAsset}
      prefetchAssetInfo={handlePrefetchAssetInfo}
      onOpenAsset={handleOpenAsset}
    />
  );
};
