import { Outlet, createBrowserRouter } from 'react-router-dom';
import { ErrorPage } from '@/shared/components/errorPage/ErrorPage';
import { DashboardPage } from '@/app/dashboardPage/DashboardPage';
import { Layout } from '@/shared/components/Layout/Layout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <DashboardPage />,
      },
    ],
  },
]);
