import { CLEAR_TOKENS } from '@/context/authContext/authReducer';
import { useAuth } from '@/hooks/useAuth/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { Link, NavLink } from 'react-router-dom';
import { Button } from '../../button/Button';
import { LogoFull } from '../../icons/LogoFull';
import { PublicContainer } from './PublicContainer';
import { routes } from '@/routes/routes';

export const PublicMenubar = () => {
  const {
    state: { isAuthorized },
  } = useAuth();

  const queryClient = useQueryClient();
  const { dispatch } = useAuth();

  const handleLogout = () => {
    dispatch({ type: CLEAR_TOKENS });
    queryClient.clear();
  };

  const mainMenuItems = [
    {
      label: 'Examples',
      href: '/examples',
    },
    {
      label: 'Docs',
      href: 'https://docs.getsalt.ai',
    },
    {
      label: 'Blog',
      href: 'https://blog.getsalt.ai',
    },
  ];

  return (
    <header className="sticky left-0 top-0 z-[100] w-full bg-[rgba(10,10,10,0.5)] text-[color:white] backdrop-blur-md transition-all duration-300 md:py-4">
      <PublicContainer>
        <nav className="rounded-xl font-medium sm:flex sm:items-center sm:justify-between" aria-label="Global">
          <NavLink className="flex-none dark:text-white md:min-w-[200px]" to={routes.home} title="Salt AI">
            <LogoFull className="w-12 md:w-16" />
          </NavLink>
          <div className="flex flex-1 items-center justify-center space-x-10 text-center">
            {mainMenuItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                className={({ isActive }) => (isActive ? 'active' : 'text-text-muted hover:text-text-base')}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="flex justify-end md:min-w-[200px]">
            {isAuthorized ? (
              <button onClick={handleLogout} title="Sign out" className="px-3 py-2 font-medium">
                Sign out
              </button>
            ) : (
              <Link to={routes.login} className="px-3 py-2 font-medium">
                Sign in
              </Link>
            )}
            <Button asLink variant="ringed" color="primary" className="ml-4" size="md" to={routes.workflows}>
              {!isAuthorized ? `Get started` : `Go to App`}
            </Button>
          </div>
        </nav>
      </PublicContainer>
    </header>
  );
};
