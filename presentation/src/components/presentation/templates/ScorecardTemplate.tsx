import type { ScorecardTemplateContent } from "@/components/presentation/presentationTypes";
import { TakeawayBand } from "@/components/presentation/TemplatePrimitives";
import { TemplateSlide } from "./TemplateSlide";

/** Decision rule + native evaluation table. One primary value driver is highlighted. */
export function ScorecardTemplate({ content }: { content: ScorecardTemplateContent }) {
  const { decisionRule, columns, highlight, takeaway } = content;
  const rowCount = Math.max(...columns.map((column) => column.rows.length));
  const cellClass = (column: number) => (column === highlight.column ? "is-highlight" : undefined);
  return <TemplateSlide kind={content.kind} title={content.chrome.title} decorativeVariant={content.decorativeVariant}>
    <section className="pdmat-template pdmat-scorecard">
      <div className="pdmat-scorecard__matrix">
        <aside className="pdmat-scorecard__rule">
          <p className="pdmat-scorecard__rule-label">{decisionRule.label}</p>
          <i aria-hidden="true" />
          <p className="pdmat-scorecard__rule-copy">{decisionRule.rule}</p>
          <i aria-hidden="true" />
          <p className="pdmat-scorecard__rule-support">{decisionRule.supporting}</p>
        </aside>
        <table className="pdmat-scorecard__table">
          <thead><tr>{columns.map((column, index) => <th key={column.title} scope="col" className={cellClass(index)}>
            <span className="pdmat-scorecard__column-title">{column.title}</span>
            <span className="pdmat-scorecard__column-question">{column.question}</span>
          </th>)}</tr></thead>
          <tbody>{Array.from({ length: rowCount }, (_, row) => <tr key={row}>{columns.map((column, index) => {
            const selected = row === highlight.row && index === highlight.column;
            return <td key={column.rows[row]} className={cellClass(index)}>
              <span className="pdmat-scorecard__cell"><span>{column.rows[row]}</span><i className={`pdmat-scorecard__selector${selected ? " is-selected" : ""}`} aria-hidden="true" /></span>
            </td>;
          })}</tr>)}</tbody>
        </table>
      </div>
      <TakeawayBand text={takeaway} className="pdmat-scorecard__takeaway" />
    </section>
  </TemplateSlide>;
}
