import { Outlet, createBrowserRouter } from 'react-router-dom';
import { ErrorPage } from '@/shared/components/errorPage/ErrorPage';
import { DashboardPage } from '@/app/dashboardPage/DashboardPage';

const Root = () => (
  <div style={{ backgroundColor: 'red' }}>
    <Outlet />
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <DashboardPage />,
      },
    ],
  },
]);
