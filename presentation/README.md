# PDMA 2026-2 — Portable presentation

**Status:** React migration scaffold. The presentation is a forkable, self-hostable copy of Jim Markunas's 16-slide *The New PM Operating System* PDMA webcast, including the interactive productization exercise.

## Launch and download

- **Play in a browser:** [GitHub Pages](https://jimmarkunas.github.io/agents-enterprise-ai-operating-model/) (available after the Pages workflow succeeds and GitHub Pages is enabled).
- **Download for offline Windows:** [Releases](https://github.com/jimmarkunas/agents-enterprise-ai-operating-model/releases/latest) (portable unsigned `.exe`).
- **Double-click without installing:** Download the offline ZIP from Releases, extract it, then open `index.html` in a modern browser. Keep the folders with it. The JavaScript and CSS are inlined in the HTML.

The Windows `.exe` is an **Electron-packaged React application**, not a raw .jsx/.js file; it does not require Node.js, your portfolio website, or a local dev server. It is unsigned; Windows SmartScreen may warn on first launch.

## Fork / independent deployment

Fork this GitHub repository into an organization-controlled account. The React source, runtime assets, and build instructions are vendored in `presentation/` and are designed to build without access to Jim's website. A fork can run `cd presentation && npm install && npm run build` and host the contents of `dist/` at any static website path. The same build can be viewed offline by double-clicking `dist/index.html`.

The pinned-source importer is a **one-time provenance tool**. Its output is checked into this repository; forked builds do not invoke it and do not need the original repository. To produce a new variant, edit the vendored React and CSS directly.

## Presentation content and branding

This first migration preserves the original PBDS visual treatment. **The requested PDMA brand redesign and PDMA-branded leave-behind are not yet implemented.** They will be separate edits against this independent app. Do not present the current design as PDMA-approved.

The slide content and A.G.E.N.T.S. framework remain attributable to Jim Markunas. PDMA is not claimed as an adopter or endorser merely because a fork is offered. A PDMA-owned fork, if created by PDMA, may support a factual fork statement; evidence of actual use requires separate confirmation.

## Development

```sh
cd presentation
npm install
npm run dev
npm run build
npm run package:windows    # Windows host recommended
```

No deployment, backend service, portfolio API, or web request is needed to present the local slides; external follow-up links intentionally open online when clicked. Verify browser rendering, all 16 slides, and exercise interaction before claiming visual or functional parity.
