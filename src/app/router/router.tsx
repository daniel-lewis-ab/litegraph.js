import { Outlet } from 'react-router-dom';
import type { RouteRecord } from 'vite-react-ssg';
import LoginPageContainer from '../loginPage/LoginPageContainer';
import { routes } from '@/routes/routes';
import AboutPage, { aboutPageLoader } from '../aboutPage/AboutPage';
import { Layout } from '@/shared/components/Layout/Layout';
import WorkflowsPageContainer from '../workflowsPage/WorkflowsPageContainer';
import DeploymentsPageContainer from '../deploymentsPage/DeploymentsPageContainer';
import { WorkflowEditorContextProvider } from '@/context/workflowEditorContext/WorkflowEditorContext';
import { WebSocketProvider } from '@/context/websocketContext/WebSocketContext';
import { ErrorPage } from '@/shared/components/errorPage/ErrorPage';
import WorkflowEditorPageContainer from '../workflowEditorPage/WorkflowEditorPageContainer';
import Storybook from '../storybook/storybook';
import NewWorkflowPageContainer from '../newWorkflowPage/NewWorkflowPageContainer';
import { AuthorizedRoute } from '@/shared/components/authorizedRoute/AuthorizedRoute';
import App from '../App';
import HomePage, { homePageLoader } from '../homePage/HomePage';

export const appRoutes: RouteRecord[] = [
  {
    path: '/',
    element: (
      <App>
        <Outlet />
      </App>
    ),
    errorElement: <div>Error occurred</div>,
    children: [
      {
        index: true,
        Component: HomePage,
        entry: 'src/app/homePage/HomePage.tsx',
        loader: homePageLoader,
      },
      {
        path: '/about',
        Component: AboutPage,
        entry: 'src/app/aboutPage/AboutPage.tsx',
        loader: aboutPageLoader,
      },
      {
        path: routes.login,
        Component: LoginPageContainer,
      },
      {
        path: routes.storybook,
        Component: Storybook,
        entry: 'src/app/storybook/storybook.tsx',
      },
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
        ],
      },
      {
        path: '*',
        Component: () => <div>Not found</div>,
      },
    ],
  },
];
