import { AuthContextStateType } from './AuthContext.types';

export const SET_AUTHORIZING = 'SET_AUTHORIZING';
export const SET_AUTHORIZED = 'SET_AUTHORIZED';
export const SET_UNAUTHORIZED = 'SET_UNAUTHORIZED';
export const SET_TOKENS = 'SET_TOKENS';
export const CLEAR_TOKENS = 'CLEAR_TOKENS';

export type Action = {
  type:
    | typeof SET_AUTHORIZING
    | typeof SET_AUTHORIZED
    | typeof SET_UNAUTHORIZED
    | typeof SET_TOKENS
    | typeof CLEAR_TOKENS;
  accessToken?: string;
  refreshToken?: string;
};

export const authReducer = (state: AuthContextStateType, action: Action): AuthContextStateType => {
  switch (action.type) {
    case SET_AUTHORIZING: {
      return {
        ...state,
        isAuthorizing: true,
      };
    }
    case SET_AUTHORIZED: {
      return {
        ...state,
        isAuthorizing: false,
        isAuthorized: true,
      };
    }
    case SET_UNAUTHORIZED: {
      return {
        ...state,
        isAuthorizing: false,
        isAuthorized: false,
      };
    }
    case SET_TOKENS:
      if (!action.accessToken || !action.refreshToken) {
        throw new Error('Missing token in authReducer');
      }

      return {
        ...state,
        accessToken: action.accessToken,
        refreshToken: action.refreshToken,
      };
    case CLEAR_TOKENS:
      return {
        ...state,
        accessToken: '',
        refreshToken: '',
      };
    default:
      return state;
  }
};
