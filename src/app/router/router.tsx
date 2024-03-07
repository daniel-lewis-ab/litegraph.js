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

export const router = createBrowserRouter([
  {
    path: routes.login,
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
        element: <WorkflowsPageContainer />,
      },
      {
        path: routes.storybook,
        element: import.meta.env.DEV ? <Storybook /> : null,
      },
      {
        path: routes.newWorkflow,
        element: <NewWorkflowPageContainer />,
      },
    ],
  },
  {
    path: '/workflows/:id',
    element: (
      <AuthorizedRoute>
        <Outlet />
      </AuthorizedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [{ index: true, element: <WorkflowEditorPageContainer /> }],
  },
]);
