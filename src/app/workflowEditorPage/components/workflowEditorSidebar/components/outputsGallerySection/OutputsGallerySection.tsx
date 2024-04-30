import { ApiWorkflowOutputAsset } from '@/api/types';
import { Icon } from '@/shared/components/icon/Icon';
import { faImages } from '@awesome.me/kit-b6cda292ae/icons/classic/solid';
import {
  faArrowDownToLine,
  faBracketsCurly,
  faShareFromSquare,
  faTrash,
} from '@awesome.me/kit-b6cda292ae/icons/sharp/regular';
import clsx from 'clsx';
import { useState } from 'react';
import { DeleteAssetConfirmationDialog } from '../DeleteAssetConfirmationDialog';
import { EditorSection } from '../EditorSection';

import { Slider } from '@/shared/components/slider/Slider';
import { TimeSince } from '@/shared/components/timeSince/TimeSince';
import { getImageUrl } from '@/shared/functions/getImageUrl';
import { faMagnifyingGlassMinus, faMagnifyingGlassPlus } from '@awesome.me/kit-b6cda292ae/icons/sharp/light';
import './OutputsGallerySection.scss';

const getImageNameFromTimestamp = (timestamp: string) => new Date(timestamp).toLocaleTimeString();

type ImageTileProps = {
  imgUrl: string;
  created_at: string;
  size: number;
  isSelected?: boolean;
  className?: string;
  onClick(): void;
};

const ImageTile = ({ imgUrl, created_at, isSelected, onClick }: ImageTileProps) => {
  return (
    <div
      style={{ backgroundImage: `url(${imgUrl})`, backgroundSize: 'contain' }}
      className={clsx('overflow group relative aspect-square cursor-pointer rounded-lg bg-center bg-no-repeat')}
      onClick={onClick}
    >
      <div className={clsx('tile-gradient absolute inset-0 rounded-md opacity-0 group-hover:opacity-0')} />
      <div
        className={clsx(
          'absolute inset-0 rounded-md border transition-all group-hover:border-surface-7',
          isSelected ? 'border-primary-10' : 'border-surfaceA-2',
        )}
      />
      <div className="up group absolute inset-0 flex flex-col justify-end text-xs opacity-10 transition-opacity group-hover:opacity-100">
        <p className="relative px-2 py-2 text-xs text-text-subtle">
          <TimeSince format="ago" time={created_at} />
        </p>
      </div>
    </div>
  );
};

type OutputsGalleryGridProps = {
  assets: ApiWorkflowOutputAsset[];
  onCopyAssetContent(imgId: string): void;
  onDownloadAsset(imgId: string): void;
  onOpenAsset(imgId: string): void;
  onDeleteOutputAsset({ assetId, executionId }: { assetId: string; executionId: string }): Promise<boolean>;
  prefetchAssetInfo(imgId: string): void;
  onClose(): void;
};

const TILE_IMG_CONFIG = {
  width: 512,
};

const getSelectedAssetExtension = (assetPath: string) => assetPath.split('.')?.[1];

const MAX_COLS_COUNT = 5;

export const OutputsGallerySection = ({
  assets,
  onCopyAssetContent,
  onDownloadAsset,
  onDeleteOutputAsset,
  prefetchAssetInfo,
  onOpenAsset,
  onClose,
}: OutputsGalleryGridProps) => {
  const [assetIdToDelete, setAssetIdToDelete] = useState<string | null>(null);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [colSize, setColSize] = useState(2);

  const onSliderChange = (value: number[]) => setColSize(value[0]);
  const onClickSmaller = () => setColSize((old) => Math.max(1, old - 1));
  const onClickLarger = () => setColSize((old) => Math.min(4, old + 1));

  const handleImageClick = (id: string) => {
    prefetchAssetInfo(id);
    setSelectedAssetId((oldImgId) => (oldImgId === id ? null : id));
  };

  const selectedAsset = assets.find((i) => i.id === selectedAssetId);

  return (
    <EditorSection icon={faImages} title="Outputs" onClose={onClose} className="relative">
      {assets.length === 0 ? <p className="text-text-subtle">No outputs yet</p> : null}
      {assets.length > 0 ? (
        <div className="no-scrollbar relative h-full overflow-auto">
          <div className="sticky top-0 z-10 mb-4 flex h-12 flex-col content-center items-center justify-center rounded-lg bg-[rgba(24,24,24,0.8)] bg-opacity-40 px-3 shadow-lg backdrop-blur-md">
            <div className="flex w-full flex-row gap-4">
              <Icon
                icon={faMagnifyingGlassMinus}
                size={20}
                onClick={onClickSmaller}
                className="cursor-pointer text-icon-muted hover:text-text-base"
              />
              <Slider
                defaultValue={[2]}
                max={MAX_COLS_COUNT}
                value={[colSize]}
                step={1}
                min={1}
                className="z-10"
                onValueChange={onSliderChange}
              />
              <Icon
                size={20}
                icon={faMagnifyingGlassPlus}
                onClick={onClickLarger}
                className="w cursor-pointer text-icon-muted hover:text-text-base"
              />
            </div>
          </div>
          <div
            className={clsx(
              'mb-14 grid gap-3',
              colSize == 1 && `grid-cols-5`,
              colSize == 2 && 'grid-cols-4',
              colSize == 3 && `grid-cols-3`,
              colSize == 4 && `grid-cols-2`,
              colSize == 5 && `grid-cols-1`,
            )}
          >
            {assets.map((i) => (
              <ImageTile
                key={i.id}
                imgUrl={getImageUrl(i.storage_path, TILE_IMG_CONFIG)}
                created_at={i.created_at}
                size={i.size}
                isSelected={selectedAssetId === i.id}
                onClick={() => handleImageClick(i.id)}
              />
            ))}
          </div>
        </div>
      ) : null}
      <div className="bottom-gradient pointer-events-none absolute bottom-0 left-0 right-0 h-[15%] opacity-80"></div>
      {selectedAssetId !== null ? (
        <div className="absolute bottom-0 left-0 right-0 m-4 flex justify-between rounded-lg bg-primary-10 px-4 py-3 *:text-black">
          <p className="font-medium">
            {getImageNameFromTimestamp(selectedAsset!.created_at)}.
            {getSelectedAssetExtension(selectedAsset!.storage_path)}
          </p>
          <div className="flex flex-row *:mr-2">
            <button className="h-6 w-6" onClick={() => onCopyAssetContent(selectedAssetId)}>
              <Icon icon={faBracketsCurly} />
            </button>
            <button className="h-6 w-6" onClick={() => onDownloadAsset(selectedAssetId)}>
              <Icon icon={faArrowDownToLine} />
            </button>
            <button className="h-6 w-6" onClick={() => onOpenAsset(selectedAssetId)}>
              <Icon icon={faShareFromSquare} />
            </button>
            <button className="h-6 w-6" onClick={() => setAssetIdToDelete(selectedAssetId)}>
              <Icon icon={faTrash} />
            </button>
            <button className="font-medium" onClick={() => setSelectedAssetId(null)}>
              Cancel
            </button>
          </div>
        </div>
      ) : null}
      <DeleteAssetConfirmationDialog
        isOpen={!!assetIdToDelete}
        onClose={() => setAssetIdToDelete(null)}
        onConfirm={async () => {
          const imageToDelete = assets.find((i) => i.id === assetIdToDelete);
          const res = await onDeleteOutputAsset({
            assetId: imageToDelete!.id,
            executionId: imageToDelete!.workflow_execution_id,
          });
          setSelectedAssetId(null);
          return res;
        }}
      />
    </EditorSection>
  );
};
