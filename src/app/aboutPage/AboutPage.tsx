import { routes } from '@/routes/routes';
import { Button } from '@/shared/components/button/Button';
import { useLoaderData, useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const data = useLoaderData() as { name: string; title: string };
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4">{data?.name}</h1>
      <Button onClick={() => navigate(routes.home)}>Go to main page</Button>
    </div>
  );
};

export default AboutPage;

// eslint-disable-next-line react-refresh/only-export-components, @typescript-eslint/require-await
export const aboutPageLoader = async () => {
  // const res = await axios.get('http://localhost:3000/cms-data');
  const resData = { name: 'This is about page which will be updated soon', title: 'About page2' };
  return resData;
};
