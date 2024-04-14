import { AngledSeparator } from '@/shared/components/publicLayout/components/angledSeparator/AngledSeparator';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { Icon } from '../../icon/Icon';
import { PublicContainer } from './PublicContainer';
import { footerLinks, socialLinks } from './PublicLinks';

export const PublicFooter = () => {
  const year = new Date().getFullYear();
  return (
    <div className={'overflow-x-hidden overflow-y-hidden'}>
      <AngledSeparator />
      <PublicContainer>
        <footer className={clsx('space-y-8 overflow-x-hidden py-10 xl:py-20')}>
          <div className="flex flex-col justify-between gap-8 md:flex-row">
            {footerLinks.map((section, i) => (
              <div key={i} className="grid w-full grid-cols-2 gap-12 md:grid-cols-3 xl:w-1/2">
                {Object.entries(section).map(([key, value]) => (
                  <div key={key} className="flex flex-col gap-8">
                    <h4 className="font-mono text-sm uppercase text-text-muted">{key}</h4>
                    <ul className="flex flex-col gap-2">
                      {value.map((item, i) => (
                        <li key={i}>
                          <Link to={item.href} className="text-base font-medium hover:opacity-80" title={item.label}>
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
            <div className="w-[140px] space-y-4 xl:w-[200px]">
              <svg viewBox="0 0 150 82" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                <path
                  d="M81.9106 60.3603H88.2642C99.704 60.3603 111.144 60.3603 122.583 60.3603C123.341 60.3603 124.103 60.3485 124.861 60.2776C127.374 60.0416 129.19 58.2891 129.678 55.5746C129.834 54.7131 129.882 53.8221 129.882 52.9429C129.898 44.9 129.898 36.8511 129.882 28.8082C129.882 27.929 129.834 27.038 129.684 26.1765C129.2 23.4502 127.401 21.6977 124.888 21.4498C124.222 21.3849 123.55 21.3672 122.879 21.3672C112.336 21.3672 101.788 21.3554 91.245 21.3731C90.2245 21.3731 89.1772 21.4144 88.1944 21.6623C85.6862 22.2878 84.4348 23.8987 84.3973 26.7429C84.3167 32.7264 84.3435 38.7099 84.3221 44.6934C84.3221 45.2304 84.2791 45.7792 84.3274 46.3103C84.6282 49.5321 83.5057 51.9456 81.3789 54.2174C73.6342 62.4964 66.0184 70.9346 58.4242 79.3788C56.9902 80.972 55.3951 81.7038 53.4293 81.7038C46.0553 81.7038 38.6812 81.686 31.3125 81.7096C29.3199 81.7155 27.7409 80.9307 26.323 79.367C18.3958 70.5865 10.4309 61.8532 2.43918 53.1376C1.10186 51.6919 0.484217 50.0632 0.500329 48.0215C0.543295 43.2654 0.543295 38.5034 0.500329 33.7473C0.484217 31.7174 1.05889 30.071 2.39084 28.6194C10.4094 19.8743 18.3958 11.0879 26.3821 2.30148C27.5207 1.0505 28.7291 0.0591481 30.4424 0.0768507C35.9797 0.124058 41.517 0.065049 47.0489 0.247976C48.0908 0.283382 49.3368 0.967884 50.1102 1.78811C56.061 8.08435 61.9205 14.4868 67.8069 20.8598C67.866 20.9247 67.8928 21.025 68.0593 21.3613C67.4954 21.3613 67.0443 21.3613 66.5931 21.3613C53.4562 21.3613 40.3193 21.3613 27.1824 21.3613C26.3338 21.3613 25.4691 21.3377 24.642 21.503C22.1338 21.9927 20.3078 23.8456 20.2702 26.6721C20.1359 36.1312 20.1198 45.6022 20.2809 55.0613C20.3346 58.1651 22.4776 60.1301 25.3348 60.2658C28.1008 60.3957 30.8721 60.3544 33.6434 60.3544C41.5062 60.3662 49.3744 60.3544 57.2372 60.3544C57.64 60.3544 58.0428 60.3603 58.4456 60.3544C62.6241 60.2245 64.5737 58.1002 64.6006 53.5093C64.6382 47.4255 64.6704 41.3417 64.5844 35.2638C64.5415 32.3311 65.3847 30.0474 67.3289 27.9585C75.1112 19.5793 82.8021 11.0879 90.4716 2.58473C92.0506 0.814461 93.8606 0.000139261 96.0733 0.00604014C103.49 0.0237428 110.907 0.0355446 118.324 0.000139262C120.494 -0.0116625 122.229 0.725948 123.803 2.47851C131.515 11.0761 139.297 19.597 147.112 28.0824C148.745 29.8586 149.561 31.7705 149.496 34.3315C149.378 38.9401 149.443 43.5546 149.475 48.1631C149.486 49.9806 149.002 51.5207 147.821 52.8071C139.539 61.8886 131.273 70.9936 122.949 80.0338C122.272 80.7714 121.187 81.4559 120.279 81.4795C114.613 81.627 108.942 81.5857 103.27 81.5916C101.793 81.5916 100.617 80.8363 99.5965 79.7328C93.8015 73.4661 88.0118 67.2053 82.2167 60.9326C82.1308 60.8382 82.0824 60.6966 81.8945 60.3603H81.9106Z"
                  fill={'var(--color-surface-12'}
                />
              </svg>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-8 md:flex-col md:justify-between lg:flex-row">
            <div className="pt-4 font-mono text-sm uppercase text-text-muted">&copy; {year} Salt AI </div>
            <div className="socialLinks grid w-[210px] grid-cols-4 content-center items-center gap-4">
              {socialLinks.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="flex aspect-square h-8 w-8 content-center items-center justify-center rounded-lg border border-border-muted hover:border-border-bright hover:bg-surface-3 lg:h-10 lg:w-10"
                  title={item.title}
                >
                  <Icon icon={item.icon} />
                </a>
              ))}
            </div>
          </div>
        </footer>
      </PublicContainer>
    </div>
  );
};
