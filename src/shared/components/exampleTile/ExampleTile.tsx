'use client';
import { ExampleRecord, FileField, UploadVideoField, WorkflowCategoryRecord } from '@/generated/graphql';
import { routes } from '@/routes/routes';
import { Icon } from '@/shared/components/icon/Icon';
import { faShareNodes } from '@awesome.me/kit-b6cda292ae/icons/classic/light';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { Image, ResponsiveImageType, VideoPlayer } from 'react-datocms';
import { Link } from 'react-router-dom';
import s from './ExampleTile.module.scss';

type ExtendedExampleAsset = {
  video: UploadVideoField;
  thumb: ResponsiveImageType; // or whatever the type of `thumb` is
} & FileField;

export const ExampleTile = ({ example }: { example: ExampleRecord }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const firstAsset = example.assets[0] as ExtendedExampleAsset;
  const isVideo = firstAsset.video;
  const isImage = firstAsset.thumb;
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered && isVideo) {
      videoRef.current?.play();
    }
    if (!isHovered && isVideo) {
      videoRef.current?.pause();
    }
  }, [isHovered, isVideo]);

  return (
    <div className="relative">
      <div className={clsx(s.cardDetail, 'absolute left-4 top-4 w-auto', !example.link && 'pointer-events-none')}>
        {example.author && !example.link && <span className="pointer-events-none">@{example.author}</span>}
        {example.author && example.link && (
          <a href={example.link} target="_blank" rel="noreferrer font-bold">
            @{example.author}
          </a>
        )}
      </div>
      <div className={clsx(s.cardDetail, 'pointer-events-none absolute right-4 top-4 w-auto')}>
        <div className="flex items-center gap-1">
          <span>
            <Icon icon={faShareNodes} /> {example.nodeCount}
          </span>
        </div>
      </div>

      <Link
        className="exampleTile group relative flex flex-col space-y-2 rounded-xl bg-surface-3 p-2 hover:bg-surface-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        to={routes.newWorkflowFromExample(example.slug)}
      >
        <div className="relative flex aspect-[4/3] w-full content-center items-center justify-center rounded-lg bg-surface-5">
          <div className="absolute h-full w-full">
            {isVideo && (
              <VideoPlayer
                data={firstAsset.video}
                loop
                playsInline
                muted
                primaryColor="var(--color-primary-10)"
                ref={videoRef}
                stream-type="live"
                className={s.videoPlayer}
              />
            )}
            {isImage && (
              <Image
                layout="fill"
                data={firstAsset.thumb}
                className="relative z-0 rounded-lg object-cover object-center transition-opacity group-hover:opacity-50"
              />
            )}
          </div>

          <div className="inline-block translate-y-2 rounded-lg bg-primary-10 px-4 py-3 font-medium text-surface-1 opacity-0 backdrop-blur-md transition-all group-hover:translate-y-0 group-hover:opacity-100">
            Open example
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-2xl font-medium leading-[120%]">{example.title}</h2>
          <p className=" min-h-24 font-inter text-xs text-text-subtle">{example.description}</p>
        </div>
        <div>
          <ul className="m-0 flex flex-wrap gap-2">
            {example.categories.map((category: WorkflowCategoryRecord) => (
              <li key={category.id} className={clsx(s.cardDetail, 'bg-surface-5')}>
                {category.title}
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </div>
  );
};
