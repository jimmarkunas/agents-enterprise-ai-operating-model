import type { ReactNode } from "react";
import { decorativeVariants, isDecorImage, type DecorItem } from "@/components/presentation/templates/DecorativeLayer";
import { PdmaScenarioExercise } from "../exercise/PdmaScenarioExercise";
import { PDMA_EXERCISE_ROUTE, PDMA_KIT_URL, pdma2026Slides, type Pdma2026SlideContent } from "./pdma2026Content";
import type { PdmaSlideKey, PdmaSlideManifestEntry } from "@/components/presentation/presentationTypes";
import { AgentsRevealSlide, agentsDecor } from "./slides/AgentsRevealSlide";
import { AmbiguityGateSlide, ambiguityDecor } from "./slides/AmbiguityGateSlide";
import { FrameworkToProductSlide, frameworkDecor } from "./slides/FrameworkToProductSlide";
import { IdeaToSpecSlide, ideaToSpecDecor } from "./slides/IdeaToSpecSlide";
import { ShiftBoundarySlide, shiftBoundaryDecor } from "./slides/ShiftBoundarySlide";
import { WorkMapSlide, workMapDecor } from "./slides/WorkMapSlide";
import { renderTemplate } from "@/components/presentation/templates/renderTemplate";

export const PDMA2026_SLIDE_COUNT = 16;

export type Pdma2026ManifestEntry = PdmaSlideManifestEntry & { composition: Pdma2026SlideContent["kind"]; qa: "targeted" };

/** One composition per slide: ten approved templates, six preserved production compositions. */
export function renderPdma2026Slide(content: Pdma2026SlideContent): ReactNode {
  switch (content.kind) {
    case "title": return renderTemplate(content);
    case "shift-boundary": return <ShiftBoundarySlide content={content} />;
    case "compare-contrast": return renderTemplate(content);
    case "work-map": return <WorkMapSlide content={content} />;
    case "ambiguity-gate": return <AmbiguityGateSlide content={content} />;
    case "hub-ecosystem": return renderTemplate(content);
    case "scorecard": return renderTemplate(content);
    case "decision-spectrum": return renderTemplate(content);
    case "flow-scenario": return renderTemplate(content);
    case "structured-content-action": return renderTemplate(content);
    case "agents-reveal": return <AgentsRevealSlide content={content} />;
    case "framework-to-product": return <FrameworkToProductSlide content={content} />;
    case "idea-to-spec": return <IdeaToSpecSlide content={content} />;
    case "exercise": return renderTemplate(content);
    case "embedded-app": return renderTemplate(content, { app: <PdmaScenarioExercise /> });
    case "end-card": return renderTemplate(content);
  }
}

const decorSources = (items: readonly DecorItem[]) => items.filter(isDecorImage).map(({ src }) => src);

function slideAssets(content: Pdma2026SlideContent): readonly string[] {
  switch (content.kind) {
    case "shift-boundary": return [...decorSources(shiftBoundaryDecor), ...content.lists.flatMap(({ items }) => items.map(({ glyph }) => glyph))];
    case "work-map": return decorSources(workMapDecor);
    case "ambiguity-gate": return decorSources(ambiguityDecor);
    case "agents-reveal": return decorSources(agentsDecor);
    case "framework-to-product": return decorSources(frameworkDecor);
    case "idea-to-spec": return [...decorSources(ideaToSpecDecor), content.before.marker, content.after.marker, content.bridge.art];
    case "exercise": return [...decorSources(decorativeVariants[content.decorativeVariant]), ...content.rows.map(({ glyph }) => glyph), content.connectorArt];
    default: return decorSources(decorativeVariants[content.decorativeVariant]);
  }
}

const routeLinks = (content: Pdma2026SlideContent) => content.kind === "exercise" || content.kind === "embedded-app" ? [PDMA_EXERCISE_ROUTE] : content.kind === "end-card" ? [PDMA_KIT_URL] : undefined;

/** The production /pdma2026 manifest: order, IDs, TOC, chrome, and composition per slide. */
export const pdma2026Manifest: readonly Pdma2026ManifestEntry[] = pdma2026Slides.map((content, index) => {
  const key = `slide-${String(index + 1).padStart(2, "0")}` as PdmaSlideKey;
  return {
    key,
    id: key,
    composition: content.kind,
    tocTitle: content.chrome.tocTitle,
    headerLabels: content.chrome.headerLabels,
    footerLabel: content.chrome.footerLabel,
    title: content.chrome.title,
    assets: slideAssets(content),
    routeLinks: routeLinks(content),
    qa: "targeted",
  };
});

export function assertPdma2026ManifestParity(manifest: readonly Pdma2026ManifestEntry[], rendered: readonly ReactNode[]) {
  if (manifest.length !== PDMA2026_SLIDE_COUNT || rendered.length !== PDMA2026_SLIDE_COUNT) throw new Error(`PDMA manifest/render parity failed: ${manifest.length} manifest entries, ${rendered.length} rendered slides`);
  if (new Set(manifest.map(({ id }) => id)).size !== PDMA2026_SLIDE_COUNT) throw new Error("PDMA manifest/render parity failed: duplicate slide id");
  if (manifest.some(({ headerLabels }) => headerLabels.length !== 3 || headerLabels.some((label) => !label.trim()))) throw new Error("PDMA manifest/render parity failed: every slide requires exactly three non-empty header labels");
  if (manifest.some(({ footerLabel }) => !footerLabel.trim())) throw new Error("PDMA manifest/render parity failed: every slide requires a non-empty footer label");
}
