export const apiEndpoints = {
  login: '/v1/token/pair',
  refreshToken: '/v1/token/refresh',
  workflows: '/v1/workflows/',
  workflow: (id: string) => `/v1/workflows/${id}/`,
  deployments: '/v1/deployments/',
  deployment: (id: string) => `/v1/deployments/${id}/`,
  websocket: '/ws/v1/artcraft/',
  workflowExecutions: (workflowId: string) => `/v1/workflows/${workflowId}/executions/`,
};
