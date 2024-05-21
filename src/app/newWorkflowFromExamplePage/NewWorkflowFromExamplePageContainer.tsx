import { useCreateWorkflowMutation } from '@/api/hooks/useCreateWorkflowMutation/useCreateWorkflowMutation';
import { ExampleRecord } from '@/generated/graphql';
import { useClientFetchDatoCms } from '@/hooks/useClientFetchDatoCms/useClientFetchDatoCms';
import { CenteredLoader } from '@/shared/components/centeredLoader/CenteredLoader';
import { PageErrorTemplate } from '@/shared/components/pageErrorTemplate/PageErrorTemplate';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { NewWorkflowFromExamplePage } from './NewWorkflowFromExamplePage';

export type NewWorkflowFromExampleFormData = {
  name: string;
  content: string;
};

const query = `
  query cloneExampleQuery($slug: String) {
    example(filter: {slug: {eq: $slug}}) {
      title
      slug
      id
      workflow {
        url
      }
    }
  }
`;

type DatoCmsData = { example: ExampleRecord };

export const NewWorkflowFromExamplePageContainer = () => {
  const { slug } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const { data, status } = useClientFetchDatoCms<DatoCmsData>(query, { slug: slug! });
  const { mutateAsync } = useCreateWorkflowMutation();

  let workflow = '';
  if (data?.example?.workflow) {
    fetch(data.example.workflow.url)
      .then((response) => response.text())
      .then((text) => {
        workflow = text;
        setIsLoading(false);
      });
  }

  const handleSubmit = async (data: NewWorkflowFromExampleFormData) => {
    return await mutateAsync({ name: data.name, content: JSON.parse(workflow) });
  };

  if (isLoading) {
    return <CenteredLoader isFullscreen />;
  }

  if (status === 'error' || !data) {
    <PageErrorTemplate variant="down" inApp />;
  }

  return <NewWorkflowFromExamplePage content={workflow} name={data!.example.title!} onSubmit={handleSubmit} />;
};
