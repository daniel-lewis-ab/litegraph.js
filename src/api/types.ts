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
  last_edited: string;
  content: string;
};

export type GetWorkflowsResponse = {
  count: number;
  links: { next: null; previous: null };
  results: Workflow[];
};
