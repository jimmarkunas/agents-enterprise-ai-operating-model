import type { ReactNode } from "react";
import type { TemplateContent } from "@/components/presentation/presentationTypes";
import { orbAppearanceProfiles } from "@/components/pbds/orb/orbPresets";
import type { DecorItem } from "./DecorativeLayer";
import { CompareContrastTemplate } from "./CompareContrastTemplate";
import { DecisionSpectrumTemplate } from "./DecisionSpectrumTemplate";
import { EmbeddedAppTemplate } from "./EmbeddedAppTemplate";
import { EndCardTemplate } from "./EndCardTemplate";
import { ExerciseTemplate } from "./ExerciseTemplate";
import { FlowScenarioTemplate } from "./FlowScenarioTemplate";
import { HubEcosystemTemplate } from "./HubEcosystemTemplate";
import { ScorecardTemplate } from "./ScorecardTemplate";
import { StructuredActionTemplate } from "./StructuredActionTemplate";
import { TitleTemplate } from "./TitleTemplate";

export type TemplateVariantId = "flow-animated-atmosphere" | "embedded-full-planets" | "hub-animated-planets" | "structured-animated-magenta";

const variantDecor: Record<Exclude<TemplateVariantId, "embedded-full-planets">, readonly DecorItem[]> = {
  "flow-animated-atmosphere": [
    { orb: "greyLeft", radius: 250, props: orbAppearanceProfiles.greyAtmosphere },
    { orb: "magentaRight", radius: 228, props: orbAppearanceProfiles.magentaAtmosphere },
  ],
  "hub-animated-planets": [
    { orb: "greyLeft", radius: 228, viewport: { x: 0, y: 580, w: 440, h: 440 }, props: orbAppearanceProfiles.greyAtmosphere },
    { orb: "magentaRight", radius: 228, viewport: { x: 1480, y: 60, w: 440, h: 440 }, props: orbAppearanceProfiles.magentaRim },
  ],
  "structured-animated-magenta": [
    { orb: "greyLeft", radius: 228, offsetY: 56, props: { ...orbAppearanceProfiles.magentaAtmosphere, skinStyle: "canonical-magenta", accentColor: "#FF2FAE", primaryDotColor: "#FF2FAE", glowingStrokeIntensity: 0.2, autoRotateSpeed: 0.0012 } },
    { orb: "magentaRight", radius: 228, offsetY: -170, props: { ...orbAppearanceProfiles.magentaAtmosphere, autoRotateSpeed: 0.0012 } },
  ],
};

const embeddedFullPlanets: readonly DecorItem[] = [
  { src: "./pdma2026-templates-lab/assets/slide-06/planet-left.png", x: -112, y: 275, w: 1000, h: 1000, fullPlane: true },
  { src: "./pdma2026-templates-lab/assets/slide-06/planet-right.png", x: 917, y: -48, w: 1253, h: 1253, fullPlane: true },
];

export function renderTemplate(content: TemplateContent, { app }: { app?: ReactNode } = {}): ReactNode {
  switch (content.kind) {
    case "title": return <TitleTemplate content={content} />;
    case "end-card": return <EndCardTemplate content={content} />;
    case "exercise": return <ExerciseTemplate content={content} />;
    case "embedded-app": return <EmbeddedAppTemplate content={content} app={app} />;
    case "compare-contrast": return <CompareContrastTemplate content={content} />;
    case "flow-scenario": return <FlowScenarioTemplate content={content} />;
    case "decision-spectrum": return <DecisionSpectrumTemplate content={content} />;
    case "hub-ecosystem": return <HubEcosystemTemplate content={content} />;
    case "scorecard": return <ScorecardTemplate content={content} />;
    case "structured-content-action": return <StructuredActionTemplate content={content} />;
  }
}

/** Render a promoted treatment with the existing template and canonical content object. */
export function renderTemplateVariant(content: TemplateContent, variant: TemplateVariantId, { app }: { app?: ReactNode } = {}): ReactNode {
  switch (variant) {
    case "flow-animated-atmosphere":
      if (content.kind !== "flow-scenario") throw new Error(`${variant} requires flow-scenario content`);
      return <FlowScenarioTemplate content={content} decorItems={variantDecor[variant]} hideLeadConnector hideTailConnector />;
    case "embedded-full-planets":
      if (content.kind !== "embedded-app") throw new Error(`${variant} requires embedded-app content`);
      return <EmbeddedAppTemplate content={content} app={app} decorItems={embeddedFullPlanets} fullPlanets />;
    case "hub-animated-planets":
      if (content.kind !== "hub-ecosystem") throw new Error(`${variant} requires hub-ecosystem content`);
      return <HubEcosystemTemplate content={content} decorItems={variantDecor[variant]} />;
    case "structured-animated-magenta":
      if (content.kind !== "structured-content-action") throw new Error(`${variant} requires structured-content-action content`);
      return <StructuredActionTemplate content={content} decorItems={variantDecor[variant]} />;
  }
}
