import { ExampleRecord } from '@/generated/graphql';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

type Asset = {
  filename: string;
  full: {
    src: string;
  };
  thumb: {
    src: string;
  };
  alt?: string;
};

type ExampleTileProps = {
  example: ExampleRecord;
};

export const ExampleTile = ({ example }: ExampleTileProps) => {
  const assets: Asset[] = example.assets.map((asset) => ({
    filename: asset.filename,
    full: {
      src: asset.url,
    },
    thumb: {
      src: asset.responsiveImage?.src ?? asset.url,
    },
    alt: asset.alt ?? undefined,
  }));

  const firstAsset = assets[0];
  const tags = example.tags?.split(',') ?? [];

  const isGif = (filename: string) => filename.toLowerCase().endsWith('.gif');

  const getImageSrc = (asset: Asset) => {
    return isGif(asset.filename) ? asset.full.src : asset.full.src;
  };

  return (
    <li className="exampleTile text-slate-200 pmd:p-6 relative flex flex-col space-y-3 rounded-md">
      <div className="">
        <Zoom zoomImg={{ width: 1500, src: firstAsset.full.src }}>
          <div className="relative w-full">
            {firstAsset && (
              <div>
                <img
                  src={getImageSrc(firstAsset)}
                  className="block w-full rounded-lg border border-border-base"
                  alt={firstAsset.alt}
                />
                <ul className="tags absolute bottom-3 left-3 flex gap-3">
                  {tags.map((tag) => (
                    <li
                      key={tag}
                      className="tag bg-blur-2xl block rounded-[8px] bg-[rgba(0,0,0,.7)] px-3 text-xs text-text-subtle"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Zoom>
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-medium md:text-xl lg:text-xl">{example.title}</h2>
        <div className="flex flex-row gap-3">
          <p className="text-gray-300 text-sm text-text-muted">by {example.author}</p>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        {assets.map((asset, i) => (
          <div key={i}>
            <Zoom zoomImg={{ width: 1920, src: asset.full.src }}>
              <img src={asset.thumb.src} className="w-20 rounded-[4px] border border-border-muted shadow-md" />
            </Zoom>
          </div>
        ))}
      </div>
      <div className="flex flex-col">
        <p className="mb-8 text-text-subtle">{example.description}</p>
      </div>
    </li>
  );
};
