import { useCreateWorkflowMutation } from '@/api/hooks/useCreateWorkflowMutation/useCreateWorkflowMutation';
import { ExampleRecord } from '@/generated/graphql';
import { fetchDatoCmsData } from '@/shared/functions/fetchDatoCmsData';
import { useLoaderData } from 'react-router-dom';
import { NewWorkflowFromExamplePage } from './NewWorkflowFromExamplePage';

export type NewWorkflowFromExampleFormData = {
  name: string;
  content: string;
};

export const NewWorkflowFromExamplePageContainer = () => {
  const { data } = useLoaderData() as { data: { data: { example: ExampleRecord } } };
  const { example } = data.data;

  const { mutateAsync } = useCreateWorkflowMutation();

  const handleSubmit = async (data: NewWorkflowFromExampleFormData) => {
    return await mutateAsync({ name: data.name, content: JSON.parse(data.content) });
  };

  return <NewWorkflowFromExamplePage content={example.json} name={example.title!} onSubmit={handleSubmit} />;
};

// eslint-disable-next-line react-refresh/only-export-components
export const newWorkflowFromExamplePageLoader = async ({ params }: { params: { slug?: string } }) => {
  if (params.slug === undefined) {
    return { status: 'error', error: new Error('Slug is undefined') };
  }

  try {
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
    const variables = { slug: params.slug };
    const data = await fetchDatoCmsData(query, variables);
    return { status: 'success', data };
  } catch (error) {
    return { status: 'error', error };
  }
};
