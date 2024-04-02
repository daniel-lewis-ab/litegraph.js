import { routes } from '@/routes/routes';
import axios from 'axios';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Head } from 'vite-react-ssg';

const HomePage = () => {
  const data = useLoaderData() as { name: string; title: string };
  const navigate = useNavigate();

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

export const homePageLoader = async () => {
  const res = await axios.get('http://localhost:3000/cms-data');
  const resData = res.data;
  return resData;
};
