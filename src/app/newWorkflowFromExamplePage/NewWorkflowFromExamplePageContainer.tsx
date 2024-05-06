import { useCreateWorkflowMutation } from '@/api/hooks/useCreateWorkflowMutation/useCreateWorkflowMutation';
import { ExampleRecord } from '@/generated/graphql';
import { useClientFetchDatoCms } from '@/hooks/useClientFetchDatoCms/useClientFetchDatoCms';
import { useParams } from 'react-router-dom';
import { NewWorkflowFromExamplePage } from './NewWorkflowFromExamplePage';
import { CenteredLoader } from '@/shared/components/centeredLoader/CenteredLoader';
import { PageErrorTemplate } from '@/shared/components/pageErrorTemplate/PageErrorTemplate';

export type NewWorkflowFromExampleFormData = {
  name: string;
  content: string;
};

const query = `
  query cloneExampleQuery($slug: String) {
    example(filter: {slug: {eq: $slug}}) {
      json
      title
      slug
      id
    }
  }
`;

type DatoCmsData = { example: ExampleRecord };

export const NewWorkflowFromExamplePageContainer = () => {
  const { slug } = useParams();
  const { data, status } = useClientFetchDatoCms<DatoCmsData>(query, { slug: slug! });
  const { mutateAsync } = useCreateWorkflowMutation();

  const handleSubmit = async (data: NewWorkflowFromExampleFormData) => {
    return await mutateAsync({ name: data.name, content: JSON.parse(data.content) });
  };

  if (status === 'loading') {
    return <CenteredLoader isFullscreen />;
  }

  if (status === 'error' || !data) {
    <PageErrorTemplate variant="down" inApp />;
  }

  return (
    <NewWorkflowFromExamplePage content={data!.example.json} name={data!.example.title!} onSubmit={handleSubmit} />
  );
};
