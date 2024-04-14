import { AboutPageRecord } from '@/generated/graphql';
import { PublicLayout } from '@/shared/components/publicLayout/PublicLayout';
import { PageTemplate } from '@/shared/components/pageTemplate/PageTemplate';
import { useLoaderData } from 'react-router-dom';
import { fetchDatoCmsData } from '@/shared/functions/fetchDatoCmsData';
import Markdown from 'react-markdown';

const AboutPage = () => {
  const data = useLoaderData() as { page: AboutPageRecord } | undefined;

  if (!data) return <div>Error occurred</div>;

  const page = data.page;

  // TODO: Handle metatags
  // const metatags = page._seoMetaTags.map((tag) => tag.attributes);

  return (
    <PublicLayout>
      <PublicLayout.Container className="space-y-4 py-[180px]">
        <PageTemplate.Title>Salt AI</PageTemplate.Title>

        <div className="space-y-8">
          <h2 className="text-2xl font-medium text-text-muted">{page.h2}</h2>
        </div>
        <Markdown className="max-w-2xl space-y-3 text-sm text-text-subtle lg:text-lg xl:text-xl">{page.body}</Markdown>
      </PublicLayout.Container>
    </PublicLayout>
  );
};

export default AboutPage;

const aboutPageQuery = `
query About {
  site: _site {
    favicon: faviconMetaTags {
      attributes
      content
      tag
    }
  }
  page: aboutPage {
    h1
    h2
    seo: _seoMetaTags {
      attributes
      content
      tag
    }
    body
  }
} `;

// eslint-disable-next-line react-refresh/only-export-components
export const aboutPageLoader = async () => {
  const res = await fetchDatoCmsData(aboutPageQuery);

  return res.data;
};
