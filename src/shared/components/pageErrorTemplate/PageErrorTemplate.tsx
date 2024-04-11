import { constants } from '@/contants';
import { Button } from '../button/Button';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/routes/routes';
import clsx from 'clsx';

type PageErrorTemplateProps = {
  variant: '404' | 'down';
  inApp?: boolean;
  className?: string;
};

export const PageErrorTemplate = ({ variant, className, inApp = true }: PageErrorTemplateProps) => {
  const navigate = useNavigate();

  return (
    <div className={clsx('flex h-full w-full flex-col items-center justify-center', className)}>
      {variant === '404' ? <p className="mb-2 font-mono text-xs">404</p> : null}
      <h1 className="text-5xl">{variant === '404' ? 'Page not found' : "Salt is down, we're on it"}</h1>
      {variant === 'down' ? <p className="mt-2">Got questions? Come find us on Discord.</p> : null}
      <div className="mt-5">
        {variant === '404' ? (
          inApp ? (
            <Button onClick={() => navigate(routes.workflows)}>Go to workflows</Button>
          ) : (
            <Button onClick={() => navigate(routes.workflows)}>Go to Homepage</Button>
          )
        ) : (
          <div className="flex flex-row *:first:mr-4">
            <Button onClick={() => window.location.reload()}>Reload page</Button>
            <Button
              variant="ringed"
              color="secondary"
              onClick={() => window.open(constants.saltAiDiscordUrl, '_blank')}
            >
              Salt Discord
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
