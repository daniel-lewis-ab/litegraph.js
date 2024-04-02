/* eslint-disable no-console */
import { routes } from '@/routes/routes';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Head } from 'vite-react-ssg';

const HomePage = () => {
  const data = useLoaderData() as { name: string; title: string };
  const navigate = useNavigate();
  console.log('data', data);

  return (
    <>
      <Head>
        <title>{data.title}</title>
      </Head>
      <div>
        <h1>Hooola {data?.name}</h1>
        <button onClick={() => navigate(routes.login)}>Login</button>
      </div>
    </>
  );
};

export default HomePage;

// eslint-disable-next-line react-refresh/only-export-components, @typescript-eslint/require-await
export const homePageLoader = async () => {
  // const res = await axios.get('http://localhost:3000/cms-data');
  const resData = { name: 'Home page', title: 'Home page' };
  return resData;
};
