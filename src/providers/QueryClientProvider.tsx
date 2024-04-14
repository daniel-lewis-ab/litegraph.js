import { QueryClient, QueryClientProvider as BaseQueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

type QueryClientProviderProps = { children: ReactNode };

export const QueryClientProvider = ({ children }: QueryClientProviderProps) => {
  return <BaseQueryClientProvider client={queryClient}>{children}</BaseQueryClientProvider>;
};
