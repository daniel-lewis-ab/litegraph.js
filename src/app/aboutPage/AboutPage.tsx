import { useLoaderData } from 'react-router-dom';

const AboutPage = () => {
  const data = useLoaderData() as { name: string; title: string };

  return <h1>About - {data.name}</h1>;
};

export default AboutPage;

// eslint-disable-next-line react-refresh/only-export-components
export const aboutPageLoader = () => {
  // const res = await axios.get('http://localhost:3000/cms-data');
  const resData = { name: 'About page', title: 'About page' };
  return resData;
};
