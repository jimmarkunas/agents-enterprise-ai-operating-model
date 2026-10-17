import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// The built page needs nothing from the network: no fetches, no remote scripts, fonts or images.
// The policy is added to the build only, because the Vite dev server needs its own websocket.
const offlineContentSecurityPolicy: Plugin = {
  name: "offline-content-security-policy",
  apply: "build",
  transformIndexHtml: (html) => html.replace("<meta charset=\"UTF-8\" />", "<meta charset=\"UTF-8\" />\n  <meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; font-src data:; connect-src 'none'; base-uri 'none'; form-action 'none'\" />"),
};

// One self-contained dist/index.html: scripts, styles, fonts and images are all inlined,
// so the same file runs from GitHub Pages, any static host, a USB stick, or a double-click.
export default defineConfig({
  base: "./",
  plugins: [react(), viteSingleFile({ removeViteModuleLoader: true }), offlineContentSecurityPolicy],
  build: { target: "es2020", assetsInlineLimit: 100_000_000, cssCodeSplit: false, outDir: "dist", emptyOutDir: true },
});
