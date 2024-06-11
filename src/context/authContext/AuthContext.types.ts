import { Action } from './authReducer';

export type AuthContextStateType = {
  isAuthorizing: boolean;
  isAuthorized: boolean;
  accessToken: string;
  refreshToken: string;
  user?: { userId: string };
};

export type AuthContextType = {
  state: AuthContextStateType;
  dispatch: React.Dispatch<Action>;
};

export type Token = {
  iat: number;
  exp: number;
  user_id: string;
};
