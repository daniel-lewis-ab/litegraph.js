export const routes = {
  home: '/',
  about: '/about',
  login: '/login',
  workflows: '/app/workflows',
  newWorkflow: '/app/workflows/new',
  workflow: (id: string) => `/app/workflows/${id}`,
  deployments: '/app/deployments',
  storybook: '/app/storybook',
};
