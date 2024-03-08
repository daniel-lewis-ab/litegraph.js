export const routes = {
  home: '/',
  login: '/login',
  workflows: '/workflows',
  newWorkflow: '/workflows/new',
  workflow: (id: string) => `/workflows/${id}`,
  storybook: '/storybook',
};
