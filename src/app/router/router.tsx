import { WorkflowEditorContextProvider } from '@/context/workflowEditorContext/WorkflowEditorContext';
import { routes } from '@/routes/routes';
import { Layout } from '@/shared/components/Layout/Layout';
import { AuthorizedRoute } from '@/shared/components/authorizedRoute/AuthorizedRoute';
import { ErrorPage } from '@/shared/components/errorPage/ErrorPage';
import { Navigate, Outlet } from 'react-router-dom';
import AboutPage, { aboutPageLoader } from '../aboutPage/AboutPage';
import { DeploymentsPageContainer } from '../deploymentsPage/DeploymentsPageContainer';
import ExamplesPage, { examplesPageLoader } from '../examplesPage/ExamplesPage';
import { HomePage } from '../homePage/HomePage';
import { NewWorkflowPageContainer } from '../newWorkflowPage/NewWorkflowPageContainer';
import { StorybookPage } from '../storybookPage/StorybookPage';
import { WorkflowEditorPageContainer } from '../workflowEditorPage/WorkflowEditorPageContainer';
import { WorkflowsPageContainer } from '../workflowsPage/WorkflowsPageContainer';
import { RouteRecord } from 'vite-react-ssg';
import LoginPageContainer from '../loginPage/LoginPageContainer';
import { App } from '../App';
import { WebSocketProvider } from '@/context/websocketContext/WebsocketContextProvider';
import { PageErrorTemplate } from '@/shared/components/pageErrorTemplate/PageErrorTemplate';
import { PublicLayout } from '@/shared/components/publicLayout/PublicLayout';

export const appRoutes: RouteRecord[] = [
  {
    path: routes.home,
    element: (
      <App>
        <Outlet />
      </App>
    ),
    errorElement: <PageErrorTemplate variant="down" inApp={false} className="h-screen" />,
    children: [
      {
        index: true,
        Component: HomePage,
        entry: 'src/app/homePage/HomePage.tsx',
        // loader: homePageLoader,
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
            <PageErrorTemplate variant="down" />
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
            errorElement: <ErrorPage />,
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
                <PageErrorTemplate variant="404" />
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
