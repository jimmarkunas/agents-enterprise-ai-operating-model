import type { DecorItem } from "@/components/presentation/templates/DecorativeLayer";
import { TemplateSlide } from "@/components/presentation/templates/TemplateSlide";
import type { AgentsRevealContent } from "../presentationTypes";

/**
 * Brand / Reveal v1 particle horizon, full-frame behind the wordmark. Decorative only.
 * Lowered 18px so the rim apex clears the shell header band (opaque over y 0–100).
 */
export const agentsDecor: readonly DecorItem[] = [
  { src: "./pdma2026-2/slide-11/slide-11-brand-reveal-particle-horizon.png", x: 0, y: 18, w: 1920, h: 1080, opacity: 0.8 },
];

/** The A.G.E.N.T.S. wordmark and proposition come from the shell title; the six domains read as equal columns. */
export function AgentsRevealSlide({ content }: { content: AgentsRevealContent }) {
  return <TemplateSlide kind={content.kind} title={content.chrome.title} decorItems={agentsDecor}>
    <section className="pdmat-template pdmat-reveal">
      <ol className="pdmat-reveal__domains">
        {content.questions.map(({ letter, title, question }) => <li key={letter}>
          <b className="pdmat-reveal__initial">{letter}</b>
          <strong className="pdmat-reveal__name">{title}</strong>
          <p className="pdmat-reveal__question">{question}</p>
        </li>)}
      </ol>
    </section>
  </TemplateSlide>;
}
