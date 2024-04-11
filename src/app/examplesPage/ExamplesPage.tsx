import { ExamplesPageRecord } from '@/generated/graphql';
import { PublicLayout } from '@/shared/components/publicLayout/PublicLayout';
import { fetchDatoCmsData } from '@/shared/functions/fetchDatoCmsData';
import { useLoaderData } from 'react-router-dom';
import { ExampleTile } from './components/ExampleTile';

const ExamplesPage = () => {
  const data = useLoaderData() as { page: ExamplesPageRecord } | undefined;

  if (!data) return <div>Error occurred</div>;

  const page: ExamplesPageRecord = data.page;

  // TODO: Handle metatags
  // const metatags = page._seoMetaTags.map((tag) => tag.attributes);

  return (
    <PublicLayout>
      <PublicLayout.Container className="py-24 pt-40">
        <div className="space-y-16">
          <div className="space-y-4">
            <h1 className="text-5xl font-medium">Example Workflows</h1>
            <h2 className="text-xl text-text-muted">{page.h2}</h2>
          </div>

          <ul className="gap-4 *:mb-2 md:grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 xl:gap-12">
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
        title
        description
        author
        tags
          assets {
          title
          alt
          filename
          url
          thumb: responsiveImage(imgixParams: { fit: crop, w: 240, h: 135, fit: crop, auto: format, fm: jpg }) {
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
          full: responsiveImage(imgixParams: { w: 1920, h: 1080, fit: crop, auto: format }) {
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
