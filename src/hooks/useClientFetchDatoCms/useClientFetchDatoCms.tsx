import { fetchDatoCmsData } from '@/shared/functions/fetchDatoCmsData';
import { useState, useEffect, useRef } from 'react';

type FetchDatoCmsState<T> = {
  data: T | null;
  error: Error | null;
  status: 'loading' | 'error' | 'success';
};

export function useClientFetchDatoCms<T>(query: string, variables?: Record<string, string>): FetchDatoCmsState<T> {
  const [state, setState] = useState<FetchDatoCmsState<T>>({
    data: null,
    error: null,
    status: 'loading',
  });

  const variablesRef = useRef<Record<string, string> | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      setState({ data: null, error: null, status: 'loading' });
      try {
        const responseBody = await fetchDatoCmsData(query, variables);

        setState({ data: responseBody.data as T, error: null, status: 'success' });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setState({ data: null, error, status: 'error' });
      }
    };

    if (JSON.stringify(variablesRef.current) === JSON.stringify(variables)) {
      return; // Skip fetching if variables have not changed
    }

    variablesRef.current = variables;

    fetchData();
  }, [query, variables]);

  return state;
}
