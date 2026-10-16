import type { DecorItem } from "@/components/presentation/templates/DecorativeLayer";
import { TakeawayBand } from "@/components/presentation/TemplatePrimitives";
import { TemplateSlide } from "@/components/presentation/templates/TemplateSlide";
import type { WorkMapContent } from "../presentationTypes";

/** Approved terrain + work-map path artwork (PBDS north star). Decorative only. */
export const workMapDecor: readonly DecorItem[] = [
  { src: "./pdma2026-2/slide-04/0c14e.png", x: -8, y: 144, w: 1920, h: 821 },
  { src: "./pdma2026-2/slide-04/bd2f1.png", x: 163, y: 276, w: 1583, h: 497 },
];

export function WorkMapSlide({ content }: { content: WorkMapContent }) {
  return <TemplateSlide kind={content.kind} title={content.chrome.title} decorItems={workMapDecor}>
    <section className="pdmat-template pdmat-workmap">
      <ol className="pdmat-workmap__modes">
        {content.modes.map((mode) => <li key={mode.number}>
          <span className="pdmat-workmap__number">{mode.number}</span>
          <h2 className="pdmat-workmap__title">{mode.title}</h2>
          <p className="pdmat-workmap__body">{mode.body}</p>
          <p className="pdmat-workmap__label">{mode.label}</p>
        </li>)}
      </ol>
      <TakeawayBand text={content.takeaway} className="pdmat-workmap__takeaway" />
    </section>
  </TemplateSlide>;
}
