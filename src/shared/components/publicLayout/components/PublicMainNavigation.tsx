import { routes } from '@/routes/routes';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Button } from '../../button/Button';
import { Icon } from '../../icon/Icon';
import { mobileMenuLinks, socialLinks } from './PublicLinks';

import { CLEAR_TOKENS } from '@/context/authContext/authReducer';
import { useAuth } from '@/hooks/useAuth/useAuth';
import { faBars, faClose } from '@awesome.me/kit-b6cda292ae/icons/sharp/light';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClientOnly } from 'vite-react-ssg';
import { LogoFull } from '../../icons/LogoFull';
import { PublicContainer } from './PublicContainer';
import { mainMenuLinks } from './PublicLinks';
import s from './PublicMainNavigation.module.scss';

const PublicMobileMenu = ({ show }: { show: boolean }) => {
  useEffect(() => {
    if (show) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [show]);

  return (
    <motion.div
      className={clsx(s.mobileMenu)}
      aria-labelledby="mobile-menu"
      role="dialog"
      animate={{ x: show ? '-100%' : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className={s.mobileMenuOverlay}>
        <div className="flex flex-col content-center justify-center space-y-6 px-6 pt-8">
          {mobileMenuLinks.map((item, i) => (
            <motion.div
              key={i}
              className={s.mobileMenuItemLink}
              animate={{ opacity: show ? 1 : 0, x: show ? 0 : 24 }}
              transition={{ delay: 0.3 + i * 0.06 }}
            >
              <NavLink to={item.href}>{item.label}</NavLink>
            </motion.div>
          ))}
        </div>
        <div className="absolute bottom-0 w-full space-y-6 p-6">
          <motion.div
            className="flex flex-col"
            animate={{ opacity: show ? 1 : 0, y: show ? 0 : 24 }}
            transition={{ delay: 0.64 }}
          >
            <Button variant="filled" size="md" color="primary" className="block w-full" to={routes.workflows}>
              <div className="py-1">Get started</div>
            </Button>
          </motion.div>
          <div className="socialLinks flex justify-between">
            {socialLinks.map((item, i) => (
              <motion.div
                key={i}
                animate={{ opacity: show ? 1 : 0, y: show ? 0 : 20 }}
                transition={{ delay: 0.64 + i * 0.03 }}
              >
                <a
                  href={item.href}
                  className="flex aspect-square h-12 w-12 content-center items-center justify-center rounded-lg border border-border-base hover:border-border-bright hover:bg-surface-3 lg:h-10 lg:w-10"
                  title={item.title}
                >
                  <Icon size={24} icon={item.icon} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <figure className={s.backdrop} />
    </motion.div>
  );
};

export const PublicMainNavigation = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const {
    state: { isAuthorized },
  } = useAuth();

  const queryClient = useQueryClient();
  const { dispatch } = useAuth();

  const handleLogout = () => {
    dispatch({ type: CLEAR_TOKENS });
    queryClient.clear();
  };

  return (
    <header className="fixed left-0 top-0 z-10 w-full  text-[color:white] transition-all duration-300">
      <nav aria-label="Global">
        <PublicContainer>
          <div className={clsx(s.mainNavigation)}>
            <NavLink className="align dark:text-white md:min-w-[200px]" to={routes.home} title="Salt AI">
              <LogoFull className="w-16" />
            </NavLink>
            <div className="hidden flex-1 items-center justify-center space-x-10 text-center sm:flex">
              {mainMenuLinks.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.href}
                  className={({ isActive }) => (isActive ? 'active' : 'text-text-muted hover:text-text-base')}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
            <div className="*>font-medium hidden justify-end space-x-8 sm:flex md:min-w-[200px]">
              {isAuthorized ? (
                <button onClick={handleLogout} title="Sign out" className="">
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
            <div className="relative flex text-surface-12 sm:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="flex flex-col content-center items-center p-2"
              >
                <Icon icon={showMobileMenu ? faClose : faBars} size={24} />
              </button>
            </div>
          </div>
        </PublicContainer>
        <figure className={s.backdrop} />
      </nav>
      <ClientOnly>{() => <PublicMobileMenu show={showMobileMenu} />}</ClientOnly>
    </header>
  );
};
