export const apiEndpoints = {
  login: '/v1/auth/login/firebase',
  refreshToken: '/v1/auth/refresh/',
  workflows: '/v1/workflows/',
  workflow: (id: string) => `/v1/workflows/${id}`,
};
