import { ReactNode, useEffect } from 'react';
import { LDProvider } from 'launchdarkly-react-client-sdk';
import { useAuth } from '@/hooks/useAuth/useAuth';
import { useLDClient } from 'launchdarkly-react-client-sdk';

export type FeatureFlags = {
  apiDeploymentEnabled: boolean;
};

const DEFAULT_FLAGS: FeatureFlags = {
  apiDeploymentEnabled: false,
};

export const FeatureFlagProvider = ({ children }: { children: ReactNode }) => {
  const { state } = useAuth();
  const ldClient = useLDClient();

  useEffect(() => {
    if (state.user?.userId && state.user?.userId.length > 0) {
      ldClient?.identify({ key: state.user?.userId });
    }
  }, [state.user?.userId, ldClient]);

  return (
    <LDProvider clientSideID={import.meta.env.VITE_LAUNCHDARKLY_CLIENT_ID} options={{ bootstrap: DEFAULT_FLAGS }}>
      {children}
    </LDProvider>
  );
};
