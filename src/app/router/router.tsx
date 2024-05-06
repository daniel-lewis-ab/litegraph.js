import { WebSocketProvider } from '@/context/websocketContext/WebsocketContextProvider';
import { WorkflowEditorContextProvider } from '@/context/workflowEditorContext/WorkflowEditorContext';
import { routes } from '@/routes/routes';
import { Layout } from '@/shared/components/Layout/Layout';
import { AuthorizedRoute } from '@/shared/components/authorizedRoute/AuthorizedRoute';
import { PageErrorTemplate } from '@/shared/components/pageErrorTemplate/PageErrorTemplate';
import { PublicLayout } from '@/shared/components/publicLayout/PublicLayout';
import { Navigate, Outlet } from 'react-router-dom';
import { RouteRecord } from 'vite-react-ssg';
import { App } from '../App';
import AboutPage, { aboutPageLoader } from '../aboutPage/AboutPage';
import { DeploymentsPageContainer } from '../deploymentsPage/DeploymentsPageContainer';
import ExamplesPage, { examplesPageLoader } from '../examplesPage/ExamplesPage';
import { HomePage } from '../homePage/HomePage';
import LoginPageContainer from '../loginPage/LoginPageContainer';
import { NewWorkflowFromExamplePageContainer } from '../newWorkflowFromExamplePage/NewWorkflowFromExamplePageContainer';
import { NewWorkflowPageContainer } from '../newWorkflowPage/NewWorkflowPageContainer';
import { StorybookPage } from '../storybookPage/StorybookPage';
import { WorkflowEditorPageContainer } from '../workflowEditorPage/WorkflowEditorPageContainer';
import { WorkflowsPageContainer } from '../workflowsPage/WorkflowsPageContainer';

export const appRoutes: RouteRecord[] = [
  {
    path: routes.home,
    element: (
      <App>
        <Outlet />
      </App>
    ),
    errorElement: <PageErrorTemplate variant="down" className="h-screen" />,
    children: [
      {
        index: true,
        Component: HomePage,
        entry: 'src/app/homePage/HomePage.tsx',
      },
      {
        path: routes.about,
        Component: AboutPage,
        entry: 'src/app/aboutPage/AboutPage.tsx',
        loader: aboutPageLoader,
      },
      {
        path: routes.examples,
        Component: ExamplesPage,
        loader: examplesPageLoader,
      },
      {
        path: routes.login,
        Component: LoginPageContainer,
      },
      {
        path: 'not-found',
        Component: () => (
          <PublicLayout hideFooter>
            <PageErrorTemplate variant="404" />
          </PublicLayout>
        ),
      },
      {
        ...(import.meta.env.MODE !== 'production'
          ? {
              path: routes.storybook,
              Component: StorybookPage,
              entry: 'src/app/storybook/storybook.tsx',
            }
          : {}),
      },

      {
        path: '/app',
        element: (
          <AuthorizedRoute>
            <Outlet />
          </AuthorizedRoute>
        ),
        errorElement: (
          <Layout>
            <PageErrorTemplate variant="down" inApp />
          </Layout>
        ),
        children: [
          {
            index: true,
            element: <Navigate to={routes.workflows} replace />,
          },
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
                entry: 'src/app/workflowsPage/WorkflowsPageContainer.tsx',
              },
              {
                path: routes.newWorkflow.replace('/app/workflows/', ''),
                element: <NewWorkflowPageContainer />,
                entry: 'src/app/newWorkflowPage/NewWorkflowPageContainer.tsx',
              },
              {
                path: routes.newWorkflowFromExample(':slug'),
                element: <NewWorkflowFromExamplePageContainer />,
                // loader: newWorkflowFromExamplePageLoader,
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
                entry: 'src/app/deploymentsPage/DeploymentsPageContainer.tsx',
              },
            ],
          },
          {
            path: routes.workflow(':id'),
            element: (
              <WebSocketProvider>
                <WorkflowEditorContextProvider>
                  <Outlet />
                </WorkflowEditorContextProvider>
              </WebSocketProvider>
            ),
            errorElement: <PageErrorTemplate variant="down" inApp className="h-screen" />,
            children: [
              {
                index: true,
                element: <WorkflowEditorPageContainer />,
                entry: 'src/app/workflowEditorPage/WorkflowEditorPageContainer.tsx',
              },
            ],
          },
          {
            path: '*',
            Component: () => (
              <Layout>
                <PageErrorTemplate variant="404" inApp />
              </Layout>
            ),
          },
        ],
      },
      {
        path: '*',
        Component: () => (
          <PublicLayout hideFooter>
            <PageErrorTemplate variant="404" />
          </PublicLayout>
        ),
      },
    ],
  },
];
