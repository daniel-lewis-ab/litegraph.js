import { ErrorBoundary } from 'react-error-boundary';
import { AuthContextProvider } from '@/context/authContext/AuthContext';
import { QueryClientProvider } from '@/providers/QueryClientProvider';
import React, { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { ClientOnly, Head } from 'vite-react-ssg';
import { createPortal } from 'react-dom';
import { useScrollToTopOnPathChange } from '@/hooks/useScrollToTopOnPathChange/useScrollToTopOnPathChange';
import { PageErrorTemplate } from '@/shared/components/pageErrorTemplate/PageErrorTemplate';

export const App = ({ children }: { children: ReactNode }) => {
  useScrollToTopOnPathChange();
  // eslint-disable-next-line no-console
  console.log('1');

  return (
    <React.StrictMode>
      {import.meta.env.MODE !== 'production' && (
        <Head>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
      )}
      <Head>
        <title>Salt AI - Workflows for the real world</title>
      </Head>
      {/* @TODO: Report to sentry */}
      <ErrorBoundary fallback={<PageErrorTemplate variant="down" className="h-screen" />}>
        <AuthContextProvider>
          <QueryClientProvider>
            <ClientOnly>
              {() => (
                <>
                  {createPortal(
                    <Toaster
                      position="bottom-right"
                      toastOptions={{
                        // success: { className: '!bg-success-10' },
                        error: { className: '!bg-error-10 !text-white' },
                      }}
                    />,
                    document.body,
                  )}
                </>
              )}
            </ClientOnly>
            {children}
          </QueryClientProvider>
        </AuthContextProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
};
