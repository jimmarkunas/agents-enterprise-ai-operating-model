# The New PM Operating System: PDMA webcast app

Jim Markunas's PDMA *Innovation in Focus* webcast (Nov 19, 2026), built as an app instead of a slide deck: 16 slides plus the live **Customer Order Exception Agent** productization exercise on slide 15, in PDMA's Innovation in Focus brand.

## Present it

- **Online:** https://jimmarkunas.github.io/agents-enterprise-ai-operating-model/
- **Offline:** download [`PDMA-Webcast-Kit.zip`](../Free%20Toolkit%20Download/PDMA%20Edition/PDMA-Webcast-Kit.zip) (presentation + leave-behind PDF and DOCX), or just `PDMA-Webcast-The-New-PM-Operating-System.html` from [Free Toolkit Download/PDMA Edition](../Free%20Toolkit%20Download/PDMA%20Edition/) or the [release](https://github.com/jimmarkunas/agents-enterprise-ai-operating-model/releases/tag/pdma-webcast-v1), and double-click the HTML. It is one HTML file with every font, image and script inside it. It makes no network requests and has nothing to install, so macOS Gatekeeper and Windows SmartScreen have nothing to block.

Controls: → / ← / Space / PageUp / PageDown (presenter clickers work), Home / End, **F** for full screen. `#7` in the URL opens slide 7. Keys pressed inside the exercise stay in the exercise.

## Host your own copy (fork)

1. Fork this repository.
2. In the fork: **Settings → Pages → Source: GitHub Actions**.
3. Run the **PDMA Webcast Presentation** workflow (Actions tab), or push any change under `presentation/`.

Your fork's Pages URL then serves the presentation. No local tooling is required. Any static host also works: upload the single built `index.html`.

## Develop

```sh
npm ci
npm run dev      # http://127.0.0.1:5173
npm run build    # typecheck → dist/index.html → scripts/verify-build.mjs
python3 scripts/package-downloads.py   # refresh the HTML + ZIP in "Free Toolkit Download/PDMA Edition/"
```

Commit the refreshed downloads with any source change: CI rebuilds them and fails if the committed copies differ.

`verify-build.mjs` fails the build if the output is more than one file, references anything external, lacks the offline Content-Security-Policy, or exceeds the **1 MB budget**.

| Path | What |
|---|---|
| `src/slides/Slides.tsx` | All 16 slides: copy and layout |
| `src/slides/slides.css` | Slide layouts on the 1920×1080 canvas |
| `src/brand/` | PDMA tokens, Poppins (OFL), logo, geometric background |
| `src/exercise/` | The productization exercise (logic unchanged from the portfolio `/pdma2026` edition; PDMA skin) |
| `scripts/brand-leave-behind.py` | Rebuilds the PDMA edition DOCX from the original: `python3 scripts/brand-leave-behind.py "../Free Toolkit Download/AGENTS-Enterprise-Model.docx" src/brand/pdma-logo.png out.docx`, then convert to PDF with LibreOffice |

Slide copy comes from Jim Markunas's `/pdma2026` production deck. The A.G.E.N.T.S. framework is attributable to Jim Markunas. Use of the PDMA mark follows PDMA's speaker template for this webcast; it does not imply PDMA endorsement of the framework.
