import { routes } from '@/routes/routes';
import { Button } from '@/shared/components/button/Button';
import { Icon } from '@/shared/components/icon/Icon';
import { PublicLayout } from '@/shared/components/publicLayout/PublicLayout';
import { faArrowUpRight } from '@awesome.me/kit-b6cda292ae/icons/sharp/thin';
import clsx from 'clsx';
import { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { ClientOnly } from 'vite-react-ssg';
import s from './HomePage.module.css';
import img from './images/deploy-discord-min.png';
import gpuPromoImg from './images/promo-gpu.svg';
import ideImg from './images/promo-ide.jpg';

const LogoAnimation = lazy(() => import('./components/LogoAnimation'));

export const HomePage = () => {
  return (
    <PublicLayout>
      <div className={s.homePage}>
        <ClientOnly>
          {() => (
            <Suspense fallback={null}>
              <LogoAnimation />
            </Suspense>
          )}
        </ClientOnly>

        <div className={s.content}>
          <div className="relative">
            <PublicLayout.Container>
              <div className="flex min-h-[70vh]  flex-col content-center items-center justify-end space-y-6 text-center md:min-h-[50vh] md:justify-center md:pt-[20vh] lg:min-h-[70vh] lg:pt-[33vh]">
                <h1 className="max-w-2xl text-5xl font-medium leading-[1] text-surface-12 md:text-8xl">
                  Workflows for the real world
                </h1>
                <h2 className={s.sectionBody}>Build faster in an open ecosystem designed for scale</h2>
                <Button size="lg" className="" color="primary" asLink to={routes.login}>
                  <span className="block px-4">Start for free</span>
                </Button>
              </div>
            </PublicLayout.Container>
          </div>

          <DeploymentsSection />
          <PublicLayout.AngledSeparator />
          <GPUSection />
          <PublicLayout.AngledSeparator />
          <IDESection />
          <PublicLayout.AngledSeparator />
          <TeamSection />
          <BigCardSection />
          <CTASection />
        </div>
      </div>
    </PublicLayout>
  );
};

export default HomePage;

const Section = ({
  children,
  name,
  id,
  className,
}: {
  children: React.ReactNode;
  name: string;
  id: string;
  className?: string;
}) => {
  return (
    <PublicLayout.Container>
      <section id={id} className={clsx(s.section, s[`section--${name}`], className)}>
        {children}
      </section>
    </PublicLayout.Container>
  );
};

const DeploymentsSection = () => {
  return (
    <Section name="deployments" id="deployments" className="pt-24">
      <div className="grid grid-cols-1 items-center gap-8 pb-12 lg:grid-cols-2">
        <div className="order-last md:order-first">
          <img src={img} alt={'Deploy to Discord and APIs with Salt'} />
        </div>
        <div className="grid-row-1 space-y-3 md:grid md:grid-cols-6">
          <div className="col-span-4 col-start-2 space-y-4">
            <div className="font-mono text-xs tracking-wide text-text-subtle">01</div>
            <h2 className={s.sectionTitle}>From proof-of-concept to production-ready in seconds</h2>
            <p className={s.sectionBody}>
              Effortlessly deploy your ComfyUI workflows to any Discord, or expose them as APIs. There&apos;s no set up,
              so the journey from idea to reality is faster.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
};

const GPUSection = () => {
  return (
    <Section name="infra" id="infra">
      <div className="grid-cols-2 items-center py-20 lg:grid">
        <div className="mb-8 grid-cols-6 flex-col space-y-3 md:mb-0 md:grid">
          <div className="col-span-4 col-start-2 space-y-4">
            <div className="font-mono text-xs tracking-wide text-text-subtle">02</div>
            <h2 className={s.sectionTitle}>High performance for you and your end user</h2>
            <p className={s.sectionBody}>
              Harness the power of top-tier GPUs, delivering the performance your projects demand in a scalable cloud
              environemnt.
            </p>
          </div>
        </div>
        <div className="text-center">
          <img src={gpuPromoImg} className="mx-auto block" />
        </div>
      </div>
    </Section>
  );
};

const IDESection = () => {
  return (
    <Section name="IDE" id="editor">
      <div className="grid-cols-2 items-center space-y-4 py-12 md:space-y-0 lg:grid">
        <div>
          <img src={ideImg} className="rounded-lg border border-border-muted" />
        </div>
        <div className="grid-cols-6 flex-col space-y-3 md:grid">
          <div className="col-span-4 col-start-2 space-y-4">
            <div className="font-mono text-xs tracking-wide text-text-subtle">03</div>
            <h2 className={s.sectionTitle}>An IDE designed with function in mind</h2>
            <p className={s.sectionBody}>
              With Salt&apos;s IDE, you have access to thousands of nodes and a web-based environment built for power
              users.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
};

const TeamSection = () => {
  return (
    <Section name="team" id="team">
      <div className="flex content-center items-center justify-center">
        <div className="max-w-3xl space-y-4">
          <div className="font-mono text-xs tracking-wide text-text-subtle">SALT TEAM</div>
          <h2 className="text-2xl leading-[1.5] md:text-3xl">
            We’re a team of creative and technical builders on a mission to make building with AI better and easier. We
            believe this requires rapid experimentation and feedback; stable, scalable infrastructure; and a way for
            builders to seamlessly share their work with those most eager to use it.
          </h2>
        </div>
      </div>
    </Section>
  );
};

const BigCardSection = () => {
  const cards = [
    {
      title: 'Check out our weekly contributions to the ComfyUI community',
      eyebrow: 'OPEN SOURCE',
      href: 'https://blog.getsalt.ai/post/mapping-the-comfyverse-using-ai-to-document-over-1600-nodes',
      datapoint: `1600+ node docs`,
    },
    {
      title: 'Join our Discord to discover the latest AI workflows & creations',
      eyebrow: 'COMMUNITY',
      href: 'https://discord.gg/saltai',
      datapoint: `1000+ members`,
    },
  ];
  return (
    <Section name="bigCards" id="bigCards">
      <div className="flex flex-col gap-8 md:flex-row md:gap-12">
        {cards.map((card, i) => (
          <Link className={clsx(s.card, 'group')} to={card.href} key={i}>
            <div className="font-mono text-xs tracking-[2px]">{card.eyebrow}</div>
            <h2 className="max-w-lg text-2xl lg:text-5xl">{card.title}</h2>
            <div className="absolute bottom-4 right-4 lg:bottom-8 lg:right-8">
              <div className="flex h-8 w-8 content-center items-center justify-center rounded-lg bg-surface-3 transition-colors md:h-16 md:w-16">
                <Icon
                  icon={faArrowUpRight}
                  size={24}
                  className="text-surface-8 transition-all group-hover:text-secondary-12"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
};

const CTASection = () => {
  return (
    <Section name="cta" id="cta">
      <div className="flex flex-col content-center items-center justify-center space-y-8">
        <h2 className="max-w-2xl text-center text-5xl md:text-6xl lg:text-8xl">Start building with Salt</h2>
        <Button asLink size="lg" className="" color="primary" to={routes.login}>
          <span className="block px-4">Start building</span>
        </Button>
      </div>
    </Section>
  );
};
