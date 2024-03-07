export type PostLoginResponse = {
  access: string;
  refresh: string;
};

export type GetRefreshTokensResponse = {
  refresh: string;
  access: string;
};

export type Workflow = {
  id: string;
  name: string;
  updated_at: string;
  content: string;
};

export type GetWorkflowsResponse = {
  // links: { next: null; previous: null };
  count: number;
  results: Workflow[];
};
