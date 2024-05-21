import { ExamplesPageRecord } from '@/generated/graphql';
import { ExampleTile } from '@/shared/components/exampleTile/ExampleTile';
import { PublicLayout } from '@/shared/components/publicLayout/PublicLayout';
import { fetchDatoCmsData } from '@/shared/functions/fetchDatoCmsData';
import { useLoaderData } from 'react-router-dom';
import './ExamplesPage.css';

const ExamplesPage = () => {
  const data = useLoaderData() as { page: ExamplesPageRecord } | undefined;
  if (!data) return <div>Error occurred</div>;

  const page: ExamplesPageRecord = data.page;

  return (
    <PublicLayout>
      <PublicLayout.Container className="py-24 pt-40">
        <div className="space-y-16">
          <div className="space-y-4">
            <h1 className="text-5xl font-medium">{page.h1}</h1>
            <h2 className="text-xl text-text-muted">{page.h2}</h2>
          </div>
          <ul className="gap-4 *:mb-2  md:grid md:grid-cols-2 md:*:mb-0 lg:grid-cols-2 xl:grid-cols-4">
            {page.examples?.map((example) => {
              return <ExampleTile key={example.title} example={example} />;
            })}
          </ul>
        </div>
      </PublicLayout.Container>
    </PublicLayout>
  );
};

export default ExamplesPage;

const examplesPageQuery = `
  query examplesPageQuery {
    site: _site {
      favicon: faviconMetaTags {
        attributes
        content
        tag
      }
    }
    page: examplesPage {
      h1
      h2
      seo: _seoMetaTags {
        attributes
        content
        tag
      }
        examples {
          link
          title
          description
          author
          id
          slug
          nodeCount
          workflow {
            url
          }
          categories {
            title
            id
          }
          assets {
            title
            alt
            filename
            url
            video {
              muxPlaybackId
              title
              width
              height
              blurUpThumb
            }
            thumb: responsiveImage(imgixParams: { w: 1024, fit: crop, auto: format, fm: jpg }) {
              srcSet
              webpSrcSet
              sizes
              src
              width
              height
              aspectRatio
              alt
              title
              base64
         
          }           
        }
      }
    }
  }`;

// eslint-disable-next-line react-refresh/only-export-components
export const examplesPageLoader = async () => {
  const res = await fetchDatoCmsData(examplesPageQuery);

  return res.data;
};
