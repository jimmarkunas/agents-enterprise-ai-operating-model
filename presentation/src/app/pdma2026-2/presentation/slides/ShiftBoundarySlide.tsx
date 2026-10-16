import { Fragment } from "react";
import type { DecorItem } from "@/components/presentation/templates/DecorativeLayer";
import { IconCircle } from "@/components/presentation/TemplatePrimitives";
import { TemplateSlide } from "@/components/presentation/templates/TemplateSlide";
import type { ShiftBoundaryContent } from "../presentationTypes";

const R = "./pdma2026-2/slide-02";

/** Human/AI boundary artwork (particle field, two spheres, their glyphs). Decorative only. */
export const shiftBoundaryDecor: readonly DecorItem[] = [
  { src: `${R}/slide-02-particle-field.png`, x: 585, y: 465, w: 750, h: 360, opacity: 0.49, ambient: "shift-field" },
  { src: `${R}/slide-02-ai-sphere.png`, x: 610, y: 485, w: 390, h: 390, ambient: "shift-ai" },
  { src: `${R}/diagram-cpu.svg`, x: 815, y: 620, w: 120, h: 120 },
  { src: `${R}/slide-02-human-sphere.png`, x: 875, y: 485, w: 390, h: 390, ambient: "shift-human" },
  { src: `${R}/diagram-brain.svg`, x: 1015, y: 620, w: 128, h: 128 },
];

export function ShiftBoundarySlide({ content }: { content: ShiftBoundaryContent }) {
  return <TemplateSlide kind={content.kind} title={content.chrome.title} decorItems={shiftBoundaryDecor}>
    <section className="pdmat-template pdmat-shift">
      {content.lists.map((list) => <section key={list.side} className={`pdmat-shift__list pdmat-shift__list--${list.side}`}>
        <h2 className="pdmat-shift__heading">{list.heading}</h2>
        <i className="pdmat-shift__rule" aria-hidden="true" />
        <ul>{list.items.map((item) => <li key={item.label}>
          <IconCircle source={{ src: item.glyph }} size={74} iconSize={32} className="pdmat-shift__tile" />
          <span>{item.label}</span>
        </li>)}</ul>
      </section>)}
      <p className="pdmat-shift__boundary">
        {content.boundary.map((group, index) => <Fragment key={index}>
          {index > 0 && <i className="pdmat-shift__divider" aria-hidden="true" />}
          <strong>{group.map((run, runIndex) => run.emphasis ? <em key={runIndex}>{run.text}</em> : <Fragment key={runIndex}>{run.text}</Fragment>)}</strong>
        </Fragment>)}
      </p>
    </section>
  </TemplateSlide>;
}
