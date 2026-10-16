import { Fragment, type CSSProperties } from "react";
import type { DecisionSpectrumTemplateContent } from "@/components/presentation/presentationTypes";
import { IconCircle } from "@/components/presentation/TemplatePrimitives";
import { TakeawayBand } from "@/components/presentation/TemplatePrimitives";
import { TemplateSlide } from "./TemplateSlide";

/** Five authority stages on the horizon arc. `lift` is data: how far a stage rises along the arc. */
export function DecisionSpectrumTemplate({ content }: { content: DecisionSpectrumTemplateContent }) {
  const { stages, progression, takeaway } = content;
  return <TemplateSlide kind={content.kind} title={content.chrome.title} decorativeVariant={content.decorativeVariant}>
    <section className="pdmat-template pdmat-spectrum">
      <ol className="pdmat-spectrum__stages">
        {stages.map((stage) => <li key={stage.number} className={`pdmat-spectrum__stage${stage.active ? " is-active" : ""}`} style={{ "--lift": `${stage.lift}px` } as CSSProperties}>
          <span className="pdmat-spectrum__number">{stage.number}</span>
          <IconCircle source={stage} size={78} iconSize={36} tone={stage.active ? "accent" : "light"} className="pdmat-spectrum__node" />
          <strong className="pdmat-spectrum__title">{stage.title}</strong>
          <p className="pdmat-spectrum__body">{stage.body}</p>
        </li>)}
      </ol>
      <p className="pdmat-spectrum__progression">
        {progression.map((label, index) => <Fragment key={label}>{index > 0 && <b aria-hidden="true">→</b>}<span>{label}</span></Fragment>)}
      </p>
      <TakeawayBand text={takeaway} className="pdmat-spectrum__takeaway" />
    </section>
  </TemplateSlide>;
}
