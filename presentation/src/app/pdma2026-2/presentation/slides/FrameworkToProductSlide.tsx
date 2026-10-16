import type { CSSProperties } from "react";
import type { DecorItem } from "@/components/presentation/templates/DecorativeLayer";
import { TemplateSlide } from "@/components/presentation/templates/TemplateSlide";
import type { FrameworkToProductContent } from "../presentationTypes";

const ORBS = "./pdma2026-templates/assets/flow-scenario";

/** Existing white-left / magenta-right edge orbs, cropped for this slide. Decorative only. */
export const frameworkDecor: readonly DecorItem[] = [
  { src: `${ORBS}/slide-09-left-orb-white-v1.png`, x: -751, y: 87, w: 950, h: 950 },
  { src: `${ORBS}/slide-09-right-orb-magenta-v1.png`, x: 1733, y: 82, w: 1000, h: 1000 },
];

/**
 * Framework panel rows and the connector layer share these tracks, so each rail starts on its
 * row and converges on the transformation node (aligned with the E row).
 */
const TRACK = { head: 81, row: 78, rail: 235, node: { x: 185, r: 30 } } as const;
const rowY = (index: number) => TRACK.head + TRACK.row * index + TRACK.row / 2;
const nodeY = rowY(2);
const railHeight = TRACK.head + TRACK.row * 6;
const DOT = 8;

function Rails({ count }: { count: number }) {
  const entry = TRACK.node.x - TRACK.node.r;
  return <svg className="pdmat-framework__rails" viewBox={`0 0 ${TRACK.rail} ${railHeight}`} aria-hidden="true">
    {Array.from({ length: count }, (_, index) => {
      const y = rowY(index);
      const d = y === nodeY ? `M${DOT} ${y}H${entry}` : `M${DOT} ${y}H${DOT + 62}C${DOT + 118} ${y} ${entry - 40} ${nodeY} ${entry} ${nodeY}`;
      return <g key={index}><path d={d} /><circle cx={DOT} cy={y} r="4" /></g>;
    })}
    <g className="pdmat-framework__node">
      <circle cx={TRACK.node.x} cy={nodeY} r={TRACK.node.r} />
      <path d={`M${TRACK.node.x - 10} ${nodeY}H${TRACK.node.x + 10}M${TRACK.node.x + 3} ${nodeY - 7}L${TRACK.node.x + 10} ${nodeY}L${TRACK.node.x + 3} ${nodeY + 7}`} />
    </g>
  </svg>;
}

export function FrameworkToProductSlide({ content }: { content: FrameworkToProductContent }) {
  const { framework, requirements } = content;
  const tracks = { "--fw-head": `${TRACK.head}px`, "--fw-row": `${TRACK.row}px`, "--fw-rail": `${TRACK.rail}px` } as CSSProperties;
  return <TemplateSlide kind={content.kind} title={content.chrome.title} decorItems={frameworkDecor}>
    <section className="pdmat-template pdmat-framework" style={tracks}>
      <article className="pdmat-framework__panel pdmat-framework__panel--framework">
        <h2>{framework.heading}</h2>
        <ol>{framework.rows.map((row) => <li key={row.letter}><b>{row.letter}</b><span>{row.label}</span></li>)}</ol>
      </article>
      <Rails count={framework.rows.length} />
      <article className="pdmat-framework__panel pdmat-framework__panel--requirements">
        <h2>{requirements.heading}</h2>
        <ol>{requirements.rows.map((row) => <li key={row.letter}><b>{row.letter}</b><span aria-hidden="true">→</span><p>{row.requirement}</p></li>)}</ol>
      </article>
    </section>
  </TemplateSlide>;
}
