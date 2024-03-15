import { Outlet, createBrowserRouter } from 'react-router-dom';
import { ErrorPage } from '@/shared/components/errorPage/ErrorPage';
import { Layout } from '@/shared/components/Layout/Layout';
import { AuthorizedRoute } from '@/shared/components/authorizedRoute/AuthorizedRoute';
import { LoginPageContainer } from '../loginPage/LoginPageContainer';
import { Storybook } from '../storybook/storybook';
import { WorkflowsPageContainer } from '../workflowsPage/WorkflowsPageContainer';
import { routes } from '@/routes/routes';
import { NewWorkflowPageContainer } from '../newWorkflowPage/NewWorkflowPageContainer';
import { WorkflowEditorPageContainer } from '../workflowEditorPageContainer/WorkflowEditorPageContainer';
import { HomePage } from '../homePage/HomePage';
import { DeploymentsPageContainer } from '../deploymentsPage/DeploymentsPageContainer';

export const router = createBrowserRouter([
  {
    path: routes.home,
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: routes.login,
    element: <LoginPageContainer />,
  },
  {
    path: routes.workflows,
    element: (
      <AuthorizedRoute>
        <Layout>
          <Outlet />
        </Layout>
      </AuthorizedRoute>
    ),
    children: [
      {
        index: true,
        element: <WorkflowsPageContainer />,
      },
      {
        path: routes.newWorkflow.replace('/workflows/', ''),
        element: <NewWorkflowPageContainer />,
      },
    ],
  },
  {
    path: routes.deployments,
    element: (
      <AuthorizedRoute>
        <Layout>
          <Outlet />
        </Layout>
      </AuthorizedRoute>
    ),
    children: [
      {
        index: true,
        element: <DeploymentsPageContainer />,
      },
    ],
  },
  {
    path: routes.workflow(':id'),
    element: (
      <AuthorizedRoute>
        <Outlet />
      </AuthorizedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [{ index: true, element: <WorkflowEditorPageContainer /> }],
  },
  // @TODO: Remove before prod
  {
    path: routes.storybook,
    element: import.meta.env.DEV ? <Storybook /> : null,
  },
]);
