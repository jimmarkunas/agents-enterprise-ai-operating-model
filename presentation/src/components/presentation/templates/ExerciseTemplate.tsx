import type { ExerciseTemplateContent } from "@/components/presentation/presentationTypes";
import { IconCircle } from "@/components/presentation/TemplatePrimitives";
import { TakeawayBand } from "@/components/presentation/TemplatePrimitives";
import { TemplateSlide } from "./TemplateSlide";

export function ExerciseTemplate({ content }: { content: ExerciseTemplateContent }) {
  const { rows, supportingLabel, connectorArt, worksheet, takeaway } = content;
  return <TemplateSlide kind={content.kind} title={content.chrome.title} decorativeVariant={content.decorativeVariant}>
    <section className="pdmat-template pdmat-exercise">
      <ol className="pdmat-exercise__rows">
        {rows.map((row) => <li key={row.number} className={`pdmat-exercise__row${row.emphasis ? " is-emphasis" : ""}`}>
          <span className="pdmat-exercise__number">{row.number}</span>
          <IconCircle source={{ src: row.glyph }} size={64} iconSize={32} tone={row.emphasis ? "accent" : "neutral"} />
          <strong className="pdmat-exercise__title">{row.title}</strong>
          <span className="pdmat-exercise__body">{row.body}</span>
        </li>)}
      </ol>
      <span className="pdmat-exercise__connector" aria-hidden="true"><img src={connectorArt} alt="" /></span>
      <aside className="pdmat-exercise__worksheet-column">
        <p className="pdmat-exercise__label">{supportingLabel}</p>
        <i className="pdmat-exercise__label-rule" aria-hidden="true" />
        <a className="pdmat-worksheet" href={worksheet.href} target="_blank" rel="noopener noreferrer" aria-label={worksheet.ariaLabel} title="Open live exercise">
          <span className="pdmat-worksheet__band">
            <span className="pdmat-worksheet__meta"><span className="pdmat-worksheet__brand">{worksheet.brand}</span><span className="pdmat-worksheet__status">{worksheet.status}</span></span>
            <span className="pdmat-worksheet__eyebrow">{worksheet.eyebrow}</span>
          </span>
          <span className="pdmat-worksheet__title">{worksheet.title}</span>
          <i className="pdmat-worksheet__rule" aria-hidden="true" />
          <span className="pdmat-worksheet__fields">
            {worksheet.fields.map((field) => <span key={field} className="pdmat-worksheet__field"><span>{field}</span><i aria-hidden="true" /><i aria-hidden="true" /></span>)}
          </span>
          <span className="pdmat-worksheet__footer"><span>{worksheet.footerLead}</span><span>{worksheet.footerBrand}</span></span>
        </a>
      </aside>
      <TakeawayBand text={takeaway} className="pdmat-exercise__takeaway" />
    </section>
  </TemplateSlide>;
}
