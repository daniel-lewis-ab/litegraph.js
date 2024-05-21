import { ApiWorkflowOutputAsset } from '@/api/types';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/shared/components/contextMenu/ContextMenu';
import { Icon } from '@/shared/components/icon/Icon';
import { Slider } from '@/shared/components/slider/Slider';
import { faMagnifyingGlassMinus, faMagnifyingGlassPlus } from '@awesome.me/kit-b6cda292ae/icons/sharp/light';

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { DeleteAssetConfirmationDialog } from '../DeleteAssetConfirmationDialog';
import { EditorSection } from '../EditorSection';
import { AssetTile } from './AssetTile';
import s from './OutputsGallerySection.module.scss';

type OutputsGalleryGridProps = {
  assets: ApiWorkflowOutputAsset[];
  onCopyAssetContent(imgId: string): void;
  onDownloadAsset(imgId: string): void;
  onOpenAsset(imgId: string): void;
  onDeleteOutputAsset({ assetId, executionId }: { assetId: string; executionId: string }): Promise<boolean>;
  prefetchAssetInfo(imgId: string): void;
  onClose(): void;
};

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
  const [sliderVal, setSliderVal] = useState(Number(localStorage.getItem('outputsSliderVal')) ?? 4);

  useEffect(() => {
    localStorage.setItem('outputsSliderVal', sliderVal.toString());
  }, [sliderVal]);

  const onSliderChange = (value: number[]) => setSliderVal(value[0]);
  const onClickSmaller = () => setSliderVal((old) => Math.max(1, old - 1));
  const onClickLarger = () => setSliderVal((old) => Math.min(4, old + 1));

  return (
    <EditorSection title="Outputs" onClose={onClose} className="relative">
      {assets.length === 0 ? <p className="text-text-subtle">No outputs yet</p> : null}
      {assets.length > 0 ? (
        <div className="no-scrollbar relative h-full overflow-auto">
          <div className="group sticky top-0 z-10 mb-2 flex flex-col content-center items-center justify-center bg-surface-2 px-2 py-2 shadow-lg">
            <div className=" flex w-full flex-row gap-4">
              <Icon
                icon={faMagnifyingGlassMinus}
                size={16}
                onClick={onClickSmaller}
                className="cursor-pointer text-icon-muted hover:text-text-base"
              />
              <Slider
                defaultValue={[2]}
                max={MAX_COLS_COUNT}
                value={[sliderVal]}
                step={1}
                min={1}
                className="z-10 opacity-50 transition-opacity duration-200 group-hover:opacity-100"
                onValueChange={onSliderChange}
              />
              <Icon
                size={16}
                icon={faMagnifyingGlassPlus}
                onClick={onClickLarger}
                className="w cursor-pointer text-icon-muted hover:text-text-base"
              />
            </div>
          </div>
          <div
            className={clsx(
              'mb-14 grid gap-3',
              sliderVal == 1 && `grid-cols-5`,
              sliderVal == 2 && 'grid-cols-4',
              sliderVal == 3 && `grid-cols-3`,
              sliderVal == 4 && `grid-cols-2`,
              sliderVal == 5 && `grid-cols-1`,
            )}
          >
            {assets.map((i) => {
              const isText = i.storage_path.includes('.txt');
              return (
                <ContextMenu
                  key={i.id}
                  onOpenChange={(open) => {
                    if (open) {
                      prefetchAssetInfo(i.id);
                      setSelectedAssetId(i.id);
                    } else {
                      setSelectedAssetId(null);
                    }
                  }}
                >
                  <ContextMenuTrigger
                    className={clsx(
                      s.outputGalleryTile,
                      selectedAssetId == i.id && s.outputGalleryTileSelected,
                      isText && 'col-span-12',
                    )}
                  >
                    <AssetTile
                      asset={i}
                      sliderVal={sliderVal}
                      selectedAssetId={selectedAssetId}
                      onOpenAsset={onOpenAsset}
                    />
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem onClick={() => onOpenAsset(i.id)}>Open</ContextMenuItem>
                    <ContextMenuItem onClick={() => onCopyAssetContent(i.id)}>Copy JSON</ContextMenuItem>
                    <ContextMenuItem onClick={() => onDownloadAsset(i.id)}>Download</ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem className="text-error-9" onClick={() => setAssetIdToDelete(i.id)}>
                      Delete
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              );
            })}
          </div>
        </div>
      ) : null}
      <div
        className={clsx(s.bottomGradient, 'pointer-events-none absolute bottom-0 left-0 right-0 h-[15%] opacity-80')}
      ></div>

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
