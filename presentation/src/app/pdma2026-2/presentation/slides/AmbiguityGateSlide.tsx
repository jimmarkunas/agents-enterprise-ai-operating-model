import type { DecorItem } from "@/components/presentation/templates/DecorativeLayer";
import { TemplateSlide } from "@/components/presentation/templates/TemplateSlide";
import type { AmbiguityGateContent } from "../presentationTypes";

/** HERO v1 signal field (white curtain left, magenta right), full-frame behind the copy. Decorative only. */
export const ambiguityDecor: readonly DecorItem[] = [
  { src: "./pdma2026-2/slide-05/slide-05-hero-signal-field.png", x: 0, y: 0, w: 1920, h: 1080, opacity: 0.8 },
];

/** "UNCLEAR PROBLEM." → regular qualifier + bold subject, one native string per condition. */
const splitCondition = (condition: string) => {
  const space = condition.indexOf(" ");
  return [condition.slice(0, space), condition.slice(space + 1)] as const;
};

export function AmbiguityGateSlide({ content }: { content: AmbiguityGateContent }) {
  return <TemplateSlide kind={content.kind} title={content.chrome.title} decorItems={ambiguityDecor}>
    <section className="pdmat-template pdmat-hero">
      <ol className="pdmat-hero__conditions">
        {content.conditions.map((condition, index) => {
          const [qualifier, subject] = splitCondition(condition);
          return <li key={condition}>
            {index > 0 && <i className="pdmat-hero__link" aria-hidden="true" />}
            <p><span>{qualifier}</span> <strong>{subject}</strong></p>
          </li>;
        })}
      </ol>
      <p className="pdmat-hero__equals">{content.equals}</p>
      <p className="pdmat-hero__result">{content.result}</p>
    </section>
  </TemplateSlide>;
}
