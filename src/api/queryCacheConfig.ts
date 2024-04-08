export const QUERY_CACHE_CONFIG = {
  // default: {
  //   staleTime: 5 * 60 * 1000, // 5m
  //   cacheTime: 10 * 60 * 1000, // 10m
  // },
  workflows: {
    staleTime: 5 * 60 * 1000,
    // cacheTime: 5 * 60 * 1000,
  },
  workflowDetails: {
    staleTime: 5 * 60 * 1000,
    // cacheTime: 5 * 60 * 1000,
  },
  executions: {
    staleTime: 2 * 60 * 1000,
    cacheTime: 2 * 60 * 1000,
  },
  executionDetails: {
    staleTime: 3 * 24 * 60 * 1000, // 3 days
    cacheTime: 24 * 60 * 1000,
  },
  workflowInputAssets: {
    staleTime: 5 * 60 * 1000, // 10m
    // cacheTime: 10 * 60 * 1000, // 10m
  },
  workflowOutputAssets: {
    staleTime: 5 * 60 * 1000, // 10m
    cacheTime: 10 * 60 * 1000, // 10m
  },
};
