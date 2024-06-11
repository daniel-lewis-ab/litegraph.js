import { ErrorBoundary } from 'react-error-boundary';
import { AuthContextProvider } from '@/context/authContext/AuthContext';
import { QueryClientProvider } from '@/providers/QueryClientProvider';
import React, { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { ClientOnly, Head } from 'vite-react-ssg';
import { createPortal } from 'react-dom';
import { useScrollToTopOnPathChange } from '@/hooks/useScrollToTopOnPathChange/useScrollToTopOnPathChange';
import { PageErrorTemplate } from '@/shared/components/pageErrorTemplate/PageErrorTemplate';
import { Tooltip } from '@/shared/components/tooltip/Tooltip';
import { FeatureFlagProvider } from '@/context/featureFlagProvider/FeatureFlagProvider';

export const App = ({ children }: { children: ReactNode }) => {
  useScrollToTopOnPathChange();

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
          <FeatureFlagProvider>
            <QueryClientProvider>
              <Tooltip.Provider delayDuration={0}>
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
              </Tooltip.Provider>
            </QueryClientProvider>
          </FeatureFlagProvider>
        </AuthContextProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
};
