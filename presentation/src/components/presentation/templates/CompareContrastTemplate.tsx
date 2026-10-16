import type { CompareContrastTemplateContent, ComparePanel } from "@/components/presentation/presentationTypes";
import { FlowRail } from "@/components/presentation/TemplatePrimitives";
import { IconCircle } from "@/components/presentation/TemplatePrimitives";
import { TakeawayBand } from "@/components/presentation/TemplatePrimitives";
import { TemplateSlide } from "./TemplateSlide";

function Panel({ panel }: { panel: ComparePanel }) {
  const last = panel.steps.length - 1;
  const emphasised = (index: number) => panel.tone === "accent" && (index === panel.accentIndex || index === last);
  return <section className={`pdmat-compare__panel pdmat-compare__panel--${panel.tone}`}>
    <h2 className="pdmat-compare__heading">{panel.heading}</h2>
    <p className="pdmat-compare__descriptor">{panel.descriptor}</p>
    <FlowRail
      variant="process"
      className="pdmat-compare__process"
      steps={panel.steps.map((step, index) => ({
        key: step.label,
        title: step.label,
        emphasis: emphasised(index),
        circle: <IconCircle glyph={step.glyph} size={88} tone={emphasised(index) ? "accent" : index === panel.accentIndex ? "light" : "neutral"} glow={index === panel.accentIndex || emphasised(index)} />,
      }))}
    />
    <hr className="pdmat-compare__rule" />
    <p className="pdmat-compare__boundary">{panel.boundary}</p>
    {panel.capabilities && <p className="pdmat-compare__capabilities">{panel.capabilities.map((capability, index) => <span key={capability}>{index > 0 && <b aria-hidden="true">•</b>}{capability}</span>)}</p>}
  </section>;
}

export function CompareContrastTemplate({ content }: { content: CompareContrastTemplateContent }) {
  const [left, right] = content.panels;
  return <TemplateSlide kind={content.kind} title={content.chrome.title} decorativeVariant={content.decorativeVariant}>
    <section className="pdmat-template pdmat-compare">
      <div className="pdmat-compare__panels">
        <Panel panel={left} />
        <i className="pdmat-compare__divider" aria-hidden="true" />
        <Panel panel={right} />
      </div>
      <TakeawayBand text={content.takeaway} className="pdmat-compare__takeaway" />
    </section>
  </TemplateSlide>;
}
