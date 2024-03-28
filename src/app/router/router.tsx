import { Outlet, createBrowserRouter } from 'react-router-dom';
import { ErrorPage } from '@/shared/components/errorPage/ErrorPage';
import { Layout } from '@/shared/components/Layout/Layout';
import { AuthorizedRoute } from '@/shared/components/authorizedRoute/AuthorizedRoute';
import { LoginPageContainer } from '../loginPage/LoginPageContainer';
import { Storybook } from '../storybook/storybook';
import { WorkflowsPageContainer } from '../workflowsPage/WorkflowsPageContainer';
import { routes } from '@/routes/routes';
import { NewWorkflowPageContainer } from '../newWorkflowPage/NewWorkflowPageContainer';
import { WorkflowEditorPageContainer } from '../workflowEditorPage/WorkflowEditorPageContainer';
import { HomePage } from '../homePage/HomePage';
import { DeploymentsPageContainer } from '../deploymentsPage/DeploymentsPageContainer';
import { WorkflowEditorContextProvider } from '@/context/workflowEditorContext/WorkflowEditorContext';
import { AboutPage } from '../aboutPage/AboutPage';

export const router = createBrowserRouter([
  { path: routes.home, element: <HomePage />, errorElement: <ErrorPage /> },
  { path: routes.about, element: <AboutPage />, errorElement: <ErrorPage /> },
  { path: routes.login, element: <LoginPageContainer />, errorElement: <ErrorPage /> },
  {
    path: '/app',
    element: (
      <AuthorizedRoute>
        <Outlet />
      </AuthorizedRoute>
    ),
    children: [
      {
        path: routes.workflows,
        element: (
          <Layout>
            <Outlet />
          </Layout>
        ),
        children: [
          {
            index: true,
            element: <WorkflowsPageContainer />,
          },
          {
            path: routes.newWorkflow.replace('/app/workflows/', ''),
            element: <NewWorkflowPageContainer />,
          },
        ],
      },
      {
        path: routes.deployments,
        element: (
          <Layout>
            <Outlet />
          </Layout>
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
          <WorkflowEditorContextProvider>
            <Outlet />
          </WorkflowEditorContextProvider>
        ),
        errorElement: <ErrorPage />,
        children: [{ index: true, element: <WorkflowEditorPageContainer /> }],
      },
      // @TODO: Remove before prod
      {
        path: routes.storybook,
        element: import.meta.env.DEV ? <Storybook /> : null,
      },
    ],
  },
]);
