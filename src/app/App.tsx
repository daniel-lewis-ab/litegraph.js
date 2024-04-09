import { ErrorBoundary } from 'react-error-boundary';
import { AuthContextProvider } from '@/context/authContext/AuthContext';
import { QueryClientProvider } from '@/providers/QueryClientProvider';
import React, { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { ClientOnly, Head } from 'vite-react-ssg';
import { createPortal } from 'react-dom';

export const App = ({ children }: { children: ReactNode }) => {
  return (
    <React.StrictMode>
      {import.meta.env.MODE !== 'production' && (
        <Head>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
      )}
      {/* @TODO: Show correct error + report to sentry */}
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
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
