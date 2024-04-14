import { routes } from '@/routes/routes';
import { faDiscord, faGithub, faLinkedin } from '@awesome.me/kit-b6cda292ae/icons/classic/brands';
import { faX } from '@awesome.me/kit-b6cda292ae/icons/sharp/light';

export const links = {
  salt: {
    examples: {
      label: 'Examples',
      href: routes.examples,
    },
    blog: {
      label: 'Blog',
      href: 'https://blog.getsalt.ai',
    },
    docs: {
      label: 'Docs',
      href: 'https://docs.getsalt.ai',
    },
    about: {
      label: 'About',
      href: routes.about,
    },
  },
  product: {
    deployments: {
      label: 'Deployments',
      href: '/#deployments',
    },
    infra: {
      label: 'Infra',
      href: '/#infra',
    },
    editor: {
      label: 'Editor',
      href: '/#ide',
    },
    team: {
      label: 'Team',
      href: '/#team',
    },
  },
  social: {
    x: {
      label: 'X',
      href: 'https://twitter.com/getsalt_ai',
      title: 'Salt AI Twitter',
      icon: faX,
    },

    discord: {
      label: 'Discord',
      href: 'https://discord.gg/saltai',
      title: 'Salt AI Discord',
      icon: faDiscord,
    },

    github: {
      label: 'Github',
      href: 'https://github.com/get-salt-AI/SaltAI',
      title: 'Salt AI Github',
      icon: faGithub,
    },
    linkedIn: {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/company/getsalt-ai',
      title: 'Salt AI LinkedIn',
      icon: faLinkedin,
    },
  },
};

export const mainMenuLinks = [links.salt.examples, links.salt.docs, links.salt.blog];
export const mobileMenuLinks = [links.salt.examples, links.salt.docs, links.salt.blog, links.salt.about];

export const socialLinks = [links.social.x, links.social.discord, links.social.github, links.social.linkedIn];

export const footerLinks = [
  {
    product: [links.product.deployments, links.product.editor, links.product.infra],
    resources: [links.salt.examples, links.salt.docs, links.social.github],
    company: [links.product.team, links.salt.about, links.salt.blog],
  },
];
