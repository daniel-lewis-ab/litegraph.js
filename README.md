# Salt Frontend

Salt Frontend uses the strengths of Vite, TailwindCSS, and the power of SWC with React.

## Quick Start

Clone the repository and install dependencies:

```bash
git clone <repository-url> salt-frontend
cd salt-frontend
npm install
```

## Scripts
- npm run dev: Launches the Vite dev server.
- npm run build: Compiles and bundles for production.
- npm run lint: Runs ESLint to catch issues.
- npm run lint-fix: Fixes ESLint issues automatically.
- npm run preview: Previews the build locally.


This setup includes Vite for a fast development experience, TailwindCSS for styling, and leverages SWC via the @vitejs/plugin-react for quick, efficient builds.

## Contributing
Contributions are welcome! Please read our contributing guidelines for details on how to submit contributions to this project.


## Known issues

There is an issue with circular dependencies in the SSG (Static Site Generator) package. Specifically, when one file imports a component from another, and then the second file attempts to import a component from the first, this creates a circular import situation. This has been causing the development command to cease functioning properly.


## SEO config

1. We setup `<meta name="robots" content="noindex, nofollow" />` for non-dev environment on every .html file (setup in `App.tsx`)
1. We also setup `<meta name="robots" content="noindex, nofollow" />` for every route under `/app` because you need to be logged in in order to get content (check `AuthorizedRoute.tsx`)
