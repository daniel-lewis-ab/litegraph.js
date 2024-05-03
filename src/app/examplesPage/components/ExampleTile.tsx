import { ExampleRecord } from '@/generated/graphql';
import { routes } from '@/routes/routes';
import { Image } from 'react-datocms';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { Link } from 'react-router-dom';
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
    alt: asset.alt ?? 'Example thumbnail',
  }));

  const firstAsset = assets[0];

  return (
    <li className="exampleTile  relative flex flex-col space-y-3 rounded-md">
      <div className="">
        {firstAsset && (
          <Link
            className="group relative flex aspect-video w-full content-center items-center justify-center rounded-lg border border-border-muted transition-all hover:border-primary-10"
            to={routes.newWorkflowFromExample(example.slug)}
          >
            <Image
              data={{ ...assets[0].full, width: 1920 }} // Add the missing width property
              layout="fill"
              className="rounded-lg transition-opacity group-hover:opacity-50"
            />
            <div className="inline-block translate-y-2 rounded-lg bg-primary-10 px-3 py-2 font-medium text-surface-1 opacity-0 backdrop-blur-lg transition-all group-hover:translate-y-0 group-hover:opacity-100">
              Open example
            </div>
          </Link>
        )}
      </div>
      <div className="py-2">
        <h2 className="text-xl font-medium md:text-xl lg:text-2xl">{example.title}</h2>
        <div className="flex flex-row gap-3 *:text-sm">
          {example.author && example.link && (
            <span>
              by&nbsp;
              <a className="text-gray-300 text-text-subtle underline hover:text-text-base" href={example.link}>
                {example.author}
              </a>
            </span>
          )}
          {example.author && !example.link && <span>by {example.author}</span>}
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
