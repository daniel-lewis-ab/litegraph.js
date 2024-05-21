import { ApiWorkflowOutputAsset } from '@/api/types';
import { TimeSince } from '@/shared/components/timeSince/TimeSince';
import { getImageUrl } from '@/shared/functions/getImageUrl';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

type ImageTileProps = {
  imgUrl: string;
  created_at: string;
  size: number;
  isSelected?: boolean;
  className?: string;
  onDoubleClick(): void;
  sliderVal?: number;
};

type VideoTileProps = {
  videoUrl: string;
  size: number;
  created_at: string;
  onDoubleClick?(): void;
  className?: string;
  isSelected?: boolean;
  sliderVal?: number;
};

type TextTileProps = {
  fileUrl: string;
  created_at: string;
  onDoubleClick?(): void;
  className?: string;
  isSelected?: boolean;
  sliderVal?: number;
};

const TILE_IMG_CONFIG = {
  width: 768,
};

const TextTile = ({ fileUrl, sliderVal, onDoubleClick, className, isSelected, created_at }: TextTileProps) => {
  const [text, setText] = useState<string | null>(null);
  const [textSize, setTextSize] = useState(16);

  const FormattedText = ({ text }: { text: string }) => {
    const paragraphs = text.split('\n\n');

    if (!paragraphs.length) {
      return text;
    }

    return (
      <div className="flex flex-col space-y-3">
        {paragraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    );
  };

  useEffect(() => {
    setTextSize(12 + 1.25 * Number(sliderVal));
  }, [sliderVal]);

  useEffect(() => {
    fetch(fileUrl)
      .then((res) => res.text())
      .then((text) => setText(text));
  }, [fileUrl]);

  return (
    <div
      className={clsx(
        'group relative cursor-pointer overflow-hidden rounded-lg border bg-surface-2 text-text-subtle transition-colors group-hover:border-surface-8',
        isSelected ? 'border-surface-12 hover:border-surface-12' : 'border-surface-5 hover:border-surface-7',
        className,
      )}
      onDoubleClick={onDoubleClick}
    >
      <div className="space-y-3 p-3">
        <div className="leading-[150%]" style={{ fontSize: textSize }}>
          {text && <FormattedText text={text} />}
        </div>
        <div className="relative pt-2 text-xs text-text-muted">
          <TimeSince format="ago" time={created_at} />
        </div>
      </div>
    </div>
  );
};

const ImageTile = ({ imgUrl, created_at, onDoubleClick }: ImageTileProps) => {
  return (
    <div onDoubleClick={onDoubleClick} className={clsx('relative aspect-square cursor-pointer rounded-lg')}>
      <img src={imgUrl} className="h-full w-full object-contain" loading="lazy" />
      <div className={clsx('tile-gradient absolute inset-0 rounded-md opacity-0 group-hover:opacity-0')} />
      <div />
      <div className="up group absolute inset-0 flex flex-col justify-end text-xs opacity-50 transition-opacity group-hover:opacity-100">
        <p className="relative px-2 py-1.5 text-xs text-text-subtle">
          <TimeSince format="ago" time={created_at} />
        </p>
      </div>
    </div>
  );
};

const VideoTile = ({ videoUrl, onDoubleClick }: VideoTileProps) => {
  return (
    <div onDoubleClick={onDoubleClick} className="aspect-square">
      <video className="h-full object-contain">
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export const AssetTile = ({
  asset,
  sliderVal,
  selectedAssetId,
  onOpenAsset,
}: {
  asset: ApiWorkflowOutputAsset;
  sliderVal: number;
  selectedAssetId: string | null;
  onOpenAsset(id: string): void;
}) => {
  const isVideo = asset.storage_path.includes('.mp4');
  const isText = asset.storage_path.includes('.txt');

  return isVideo ? (
    <VideoTile
      sliderVal={sliderVal}
      created_at={asset.created_at}
      videoUrl={asset.asset_url}
      key={asset.id}
      size={asset.size}
      isSelected={selectedAssetId == asset.id}
      onDoubleClick={() => onOpenAsset(asset.id)}
    />
  ) : isText ? (
    <TextTile
      sliderVal={sliderVal}
      key={asset.id}
      fileUrl={getImageUrl(asset.storage_path, TILE_IMG_CONFIG)}
      created_at={asset.created_at}
      isSelected={selectedAssetId === asset.id}
      onDoubleClick={() => onOpenAsset(asset.id)}
    />
  ) : (
    <ImageTile
      key={asset.id}
      imgUrl={getImageUrl(asset.storage_path, TILE_IMG_CONFIG)}
      created_at={asset.created_at}
      size={asset.size}
      isSelected={selectedAssetId === asset.id}
      onDoubleClick={() => onOpenAsset(asset.id)}
    />
  );
};
