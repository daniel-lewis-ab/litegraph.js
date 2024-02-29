import { Outlet, createBrowserRouter } from 'react-router-dom';
import { ErrorPage } from '@/shared/components/errorPage/ErrorPage';
import { DashboardPage } from '@/app/dashboardPage/DashboardPage';
import { Layout } from '@/shared/components/Layout/Layout';
import { AuthorizedRoute } from '@/shared/components/authorizedRoute/AuthorizedRoute';
import { LoginPageContainer } from '../loginPage/LoginPageContainer';
import { Storybook } from '../storybook/storybook';

export const isAuthenticated = () => {
  return false;
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPageContainer />,
  },
  {
    path: '/',
    element: (
      <AuthorizedRoute>
        <Layout>
          <Outlet />
        </Layout>
      </AuthorizedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'storybook',
        element: import.meta.env.DEV ? <Storybook /> : null,
      },
    ],
  },
]);
