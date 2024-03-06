export const apiEndpoints = {
  login: '/v1/token/pair',
  refreshToken: '/v1/token/refresh',
  workflows: '/v1/workflows/',
  workflow: (id: string) => `/v1/workflows/${id}`,
};
