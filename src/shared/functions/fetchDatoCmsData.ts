export async function fetchDatoCmsData(query: string, variables?: Record<string, string>) {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${import.meta.env.VITE_DATOCMS_API_TOKEN}`,
    'X-Environment': `${import.meta.env.VITE_DATOCMS_ENVIRONMENT}`,
    'Content-Type': 'application/json',
  };

  if (import.meta.env.MODE !== 'production') {
    headers['X-Include-Drafts'] = 'true';
  }

  const response = await fetch('https://graphql.datocms.com/', {
    method: 'POST',
    headers: headers,

    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${JSON.stringify(responseBody)}`);
  }

  return responseBody;
}
