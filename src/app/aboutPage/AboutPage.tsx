/* eslint-disable no-console */
import { useLoaderData } from 'react-router-dom';

const AboutPage = () => {
  const data = useLoaderData() as { name: string; title: string };
  console.log('data', data);

  return <h1>About - {data.name}</h1>;
};

export default AboutPage;

// eslint-disable-next-line react-refresh/only-export-components, @typescript-eslint/require-await
export const aboutPageLoader = async () => {
  // const res = await axios.get('http://localhost:3000/cms-data');
  const resData = { name: 'About page', title: 'About page' };
  return resData;
};
