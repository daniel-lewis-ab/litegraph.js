export async function fetchDatoCmsData(query: string, variables?: Record<string, string>) {
  const response = await fetch('https://graphql.datocms.com/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_DATOCMS_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
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
