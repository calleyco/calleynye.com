# calleynye.com

Personal portfolio and writing site for Calley Nye.

## Stack

- Next.js 15 App Router
- React 19
- TypeScript strict mode
- Tailwind CSS v4
- Vitest unit tests
- Playwright plus axe-core accessibility tests

## Local Development

```bash
nvm use
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Launch Checks

Run these before deploy:

```bash
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
pnpm audit
```

The Playwright suite starts a production build and fails on any axe-core violation across the primary launch routes.
If a stale local server is already running on port 3000, stop it before trusting local e2e results.

## Deployment

Deploy with Vercel after the launch checks pass and Lighthouse targets have been verified:

- Performance: 95+
- Accessibility: 100
- Best Practices: 95+
- SEO: 95+
