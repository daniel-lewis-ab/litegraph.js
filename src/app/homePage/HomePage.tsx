import { routes } from '@/routes/routes';
import { Button } from '@/shared/components/button/Button';
import { useLoaderData, useNavigate } from 'react-router-dom';

const HomePage = () => {
  const data = useLoaderData() as { name: string; title: string };
  const navigate = useNavigate();

  return (
    <>
      {/* <Head>
        <title>{data.title}</title>
      </Head> */}
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="mb-4">{data?.name}</h1>
        <Button onClick={() => navigate(routes.login)}>Login</Button>
      </div>
    </>
  );
};

export default HomePage;

// eslint-disable-next-line react-refresh/only-export-components, @typescript-eslint/require-await
export const homePageLoader = async () => {
  // const res = await axios.get('http://localhost:3000/cms-data');
  const resData = { name: 'This is home page placeholder, will be updated soon', title: 'Home page2' };
  return resData;
};
