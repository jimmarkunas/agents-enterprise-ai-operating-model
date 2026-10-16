import type { ReactNode } from "react";
import type { EmbeddedAppTemplateContent } from "@/components/presentation/presentationTypes";
import { EmbeddedAppFrame } from "@/components/presentation/TemplatePrimitives";
import { TemplateSlide } from "./TemplateSlide";
import type { DecorItem } from "./DecorativeLayer";

/** Title/subtitle + dominant live app frame. `app` is any interactive React child. */
export function EmbeddedAppTemplate({ content, app, decorItems, fullPlanets = false }: { content: EmbeddedAppTemplateContent; app: ReactNode; decorItems?: readonly DecorItem[]; fullPlanets?: boolean }) {
  return <TemplateSlide kind={content.kind} title={content.chrome.title} decorativeVariant={content.decorativeVariant} decorItems={decorItems} className={fullPlanets ? "pdmat-embedded--full-planets" : undefined}>
    <section className="pdmat-template pdmat-embedded">
      <EmbeddedAppFrame label={content.frameLabel}>{app}</EmbeddedAppFrame>
    </section>
  </TemplateSlide>;
}
