import { ReactNode, createContext, useEffect, useMemo, useReducer } from 'react';
import { CLEAR_TOKENS, SET_AUTHORIZED, SET_TOKENS, SET_UNAUTHORIZED, authReducer } from './authReducer';
import { jwtDecode } from 'jwt-decode';
import { axiosClient } from '@/api/axiosClient';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { apiEndpoints } from '@/api/apiEndpoints';
import { AxiosRequestConfig } from 'axios';
import { AuthContextType, Token } from './AuthContext.types';
import { GetRefreshTokensResponse } from '@/api/types';
import Cookies from 'js-cookie';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthorizing: true,
    isAuthorized: false,
    accessToken: String(localStorage.getItem('accessToken')),
    refreshToken: String(localStorage.getItem('refreshToken')),
  });

  useEffect(() => {
    try {
      localStorage.setItem('accessToken', state.accessToken);
      localStorage.setItem('refreshToken', state.refreshToken);

      const decodedToken = jwtDecode<Token>(state.accessToken);
      const decodedRefreshToken = jwtDecode<Token>(state.refreshToken);
      const expirationTime = decodedToken.exp * 1000;
      const refreshExpirationTime = decodedRefreshToken.exp * 1000;

      if (expirationTime > new Date().getTime() || refreshExpirationTime > new Date().getTime()) {
        return dispatch({
          type: SET_AUTHORIZED,
          userId: decodedToken.user_id,
        });
      }

      throw new Error('User is unauthorized');
    } catch (error) {
      return dispatch({
        type: SET_UNAUTHORIZED,
      });
    }
  }, [state.accessToken, state.refreshToken]);

  useEffect(() => {
    // We access this cookie in iframe
    Cookies.set('accessToken', state.accessToken, { domain: import.meta.env.VITE_COOKIE_DOMAIN });
  }, [state.accessToken]);

  useEffect(() => {
    const refreshAuthLogic = (failedRequest: { response: { config: AxiosRequestConfig } }) => {
      const refreshToken = localStorage.getItem('refreshToken');
      return axiosClient
        .post<GetRefreshTokensResponse>(apiEndpoints.refreshToken, { refresh: refreshToken }, {
          skipAuthRefresh: true,
        } as object)
        .then((tokenRefreshResponse) => {
          if (tokenRefreshResponse.status === 200) {
            if (failedRequest?.response?.config?.headers) {
              failedRequest.response.config.headers.Authorization = 'Bearer ' + tokenRefreshResponse.data.access;
            }

            localStorage.setItem('accessToken', tokenRefreshResponse?.data?.access);
            localStorage.setItem('refreshToken', tokenRefreshResponse?.data?.refresh);
            dispatch({
              type: SET_TOKENS,
              accessToken: tokenRefreshResponse?.data?.access,
              refreshToken: tokenRefreshResponse?.data?.refresh,
            });

            return Promise.resolve();
          }

          // Tokens expired, clean them up and logout
          dispatch({ type: CLEAR_TOKENS });
          return Promise.reject();
        })
        .catch(() => {
          dispatch({ type: CLEAR_TOKENS });
          return Promise.reject();
        });
    };

    createAuthRefreshInterceptor(axiosClient, refreshAuthLogic, { statusCodes: [401, 403] });
  }, []);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
