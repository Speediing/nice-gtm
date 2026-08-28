# NiCE x SpaceXAI

Private NiCE GTM leave-behind for Grok Bot.

The local NiCE wordmark is the official master SVG published by NiCE at
`https://resources.nice.com/wp-content/uploads/2025/05/nice-new-logo.svg`.

## What it is

The page shows three sample GTM jobs. Each job has a scene-by-scene
storyboard, a final work artifact, and an interactive Grok Bot demo with chat
on the left and the agent computer on the right.

## Run locally

```bash
cp .env.example .env.local
npm install
npm run dev
```

Set `SITE_PASSWORD` in `.env.local`, then open
[http://localhost:3000](http://localhost:3000).

## Verify

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run audit:residue
npm run verify:responsive
```
