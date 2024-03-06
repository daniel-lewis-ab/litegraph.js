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
  imageUrl?: string;
  nodesCount?: number;
};

export type GetWorkflowsResponse = {
  results: Workflow[];
};
