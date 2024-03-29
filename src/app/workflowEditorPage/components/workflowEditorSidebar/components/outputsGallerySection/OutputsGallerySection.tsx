import { faImages } from '@awesome.me/kit-b6cda292ae/icons/classic/solid';
import clsx from 'clsx';
import { EditorSection } from '../EditorSection';
import { useState } from 'react';
import { Icon } from '@/shared/components/icon/Icon';
import { faArrowDownToLine, faBracketsCurly, faTrash } from '@awesome.me/kit-b6cda292ae/icons/sharp/regular';
import { ApiWorkflowAsset } from '@/api/types';
import { DeleteAssetConfirmationDialog } from '../DeleteAssetConfirmationDialog';

import './OutputsGallerySection.scss';
import { TimeSince } from '@/shared/components/timeSince/TimeSince';

type ImageTileProps = {
  imgUrl: string;
  name: string;
  created_at: string;
  size: number;
  isSelected?: boolean;
  className?: string;
  onClick(): void;
};

const ImageTile = ({ imgUrl, name, created_at, size, isSelected, onClick }: ImageTileProps) => {
  const sizeInkB = Math.round(size / 1024);

  return (
    <div
      style={{ backgroundImage: `url(${imgUrl})` }}
      className={clsx('overflow relative aspect-square cursor-pointer select-none rounded-lg bg-cover bg-no-repeat')}
      onClick={onClick}
    >
      <div className={clsx('tile-gradient absolute inset-0 rounded-lg')} />
      <div
        className={clsx('absolute inset-0 rounded-lg border', isSelected ? 'border-primary-10' : 'border-transparent')}
      />
      <div className="absolute inset-0 flex flex-col justify-end rounded-lg p-2">
        <p className="truncate text-sm">{name}</p>
        <p className="text-xs text-text-subtle">
          <TimeSince format="short" time={created_at} /> • {sizeInkB} KB
        </p>
      </div>
    </div>
  );
};

type OutputsGalleryGridProps = {
  assets: ApiWorkflowAsset[];
  onCopyAssetContent(imgId: string): void;
  onDownloadAsset(imgId: string): void;
  onDeleteOutputAsset({ assetId, executionId }: { assetId: string; executionId: string }): Promise<boolean>;
  prefetchAssetInfo(imgId: string): void;
  onClose(): void;
};

export const OutputsGallerySection = ({
  assets,
  onCopyAssetContent,
  onDownloadAsset,
  onDeleteOutputAsset,
  prefetchAssetInfo,
  onClose,
}: OutputsGalleryGridProps) => {
  const [imageIdToDelete, setImageIdToDelete] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const handleImageClick = (id: string) => {
    prefetchAssetInfo(id);
    setSelectedImageId((oldImgId) => (oldImgId === id ? null : id));
  };

  return (
    <EditorSection icon={faImages} title="Outputs" onClose={onClose} className="relative">
      {assets.length === 0 ? <p>No generated outputs</p> : null}
      {assets.length > 0 ? (
        <div className="no-scrollbar h-full overflow-auto">
          <div className="mb-14 grid grid-cols-3 gap-2">
            {assets.map((i) => (
              <ImageTile
                key={i.id}
                imgUrl={i.asset_url}
                name={i.name}
                created_at={i.created_at}
                size={i.size}
                isSelected={selectedImageId === i.id}
                onClick={() => handleImageClick(i.id)}
              />
            ))}
          </div>
        </div>
      ) : null}
      <div className="bottom-gradient pointer-events-none absolute bottom-0 left-0 right-0 h-[15%] opacity-80"></div>
      {selectedImageId !== null ? (
        <div className="absolute bottom-0 left-0 right-0 m-4 flex justify-between rounded-lg bg-primary-10 px-4 py-3 *:text-black">
          <p className="font-medium">txt2img-optimized.png</p>
          <div className="flex flex-row *:mr-2">
            <button className="h-6 w-6" onClick={() => onCopyAssetContent(selectedImageId)}>
              <Icon icon={faBracketsCurly} />
            </button>
            <button className="h-6 w-6" onClick={() => onDownloadAsset(selectedImageId)}>
              <Icon icon={faArrowDownToLine} />
            </button>
            <button className="h-6 w-6" onClick={() => setImageIdToDelete(selectedImageId)}>
              <Icon icon={faTrash} />
            </button>
            <button className="font-medium" onClick={() => setSelectedImageId(null)}>
              Cancel
            </button>
          </div>
        </div>
      ) : null}
      <DeleteAssetConfirmationDialog
        isOpen={!!imageIdToDelete}
        onClose={() => setImageIdToDelete(null)}
        onConfirm={async () => {
          const imageToDelete = assets.find((i) => i.id === imageIdToDelete);
          const res = await onDeleteOutputAsset({
            assetId: imageToDelete!.id,
            executionId: imageToDelete!.workflow_execution_id,
          });
          setSelectedImageId(null);
          return res;
        }}
      />
    </EditorSection>
  );
};
