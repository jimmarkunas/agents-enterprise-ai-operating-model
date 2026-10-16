"use client";

import type { CSSProperties, KeyboardEvent, ReactNode } from "react";
import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import type { EndCardTemplateContent, IconSource } from "@/components/presentation/presentationTypes";
import { createQrMatrix } from "./qrMatrix";

type ConnectorKind = "glyph" | "rail" | "flow";

export function Connector({ kind, startDot = false, endDot = false, arrow = false, className = "" }: { kind: ConnectorKind; startDot?: boolean; endDot?: boolean; arrow?: boolean; className?: string }) {
  if (kind === "glyph") return <span className={`pdmat-connector pdmat-connector--glyph ${className}`.trim()} aria-hidden="true">→</span>;
  if (kind === "rail") return <span className={`pdmat-connector pdmat-connector--rail ${className}`.trim()} aria-hidden="true"><i /><ArrowRight size={26} strokeWidth={2} /><i /></span>;
  return <span className={`pdmat-connector pdmat-connector--flow${arrow ? " has-arrow" : ""} ${className}`.trim()} aria-hidden="true">
    {startDot && <b className="pdmat-connector__dot pdmat-connector__dot--start" />}
    <i />
    {arrow && <ArrowRight className="pdmat-connector__arrow" size={30} strokeWidth={2} />}
    {endDot && <b className="pdmat-connector__dot pdmat-connector__dot--end" />}
  </span>;
}

export function FanConnector({ side, from, to, className = "" }: { side: "into-right" | "out-of-left"; from: readonly number[]; to: readonly number[]; className?: string }) {
  const bankX = side === "into-right" ? 0 : 100;
  const portX = side === "into-right" ? 100 : 0;
  return <span className={`pdmat-fan pdmat-fan--${side} ${className}`.trim()} aria-hidden="true">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none">
      {from.map((y, index) => <line key={`${y}-${index}`} x1={bankX} y1={y} x2={portX} y2={to[index]} vectorEffect="non-scaling-stroke" />)}
    </svg>
    {from.map((y, index) => <b key={`bank-${index}`} className="pdmat-fan__dot pdmat-fan__dot--bank" style={{ "--dot-y": `${y}%` } as CSSProperties} />)}
    {[...new Set(to)].map((y) => <b key={`port-${y}`} className="pdmat-fan__dot pdmat-fan__dot--port" style={{ "--dot-y": `${y}%` } as CSSProperties} />)}
  </span>;
}

type ContentCardTone = "neutral" | "accent" | "outline";
export function ContentCard({ tone = "neutral", className = "", children }: { tone?: ContentCardTone; className?: string; children: ReactNode }) {
  return <article className={`pdmat-card pdmat-card--${tone} ${className}`.trim()}>{children}</article>;
}

const QUIET_ZONE = 4;
export function NativeQrCode({ value, label }: { value: string; label: string }) {
  const matrix = useMemo(() => createQrMatrix(value), [value]);
  const size = matrix.length + QUIET_ZONE * 2;
  const path = useMemo(() => matrix.flatMap((row, y) => row.map((dark, x) => (dark ? `M${x + QUIET_ZONE} ${y + QUIET_ZONE}h1v1h-1z` : ""))).join(""), [matrix]);
  return <svg className="pdmat-qr" viewBox={`0 0 ${size} ${size}`} shapeRendering="crispEdges" role="img" aria-label={label} data-qr-value={value}>
    <rect width={size} height={size} fill="#ffffff" />
    <path d={path} fill="#090909" />
  </svg>;
}

export function DownloadModule({ download }: { download: EndCardTemplateContent["download"] }) {
  const { url, eyebrow, title, description, teamPrompt, actions, ctaLabel, qrAriaLabel } = download;
  return <section className="pdmat-download" aria-label={title}>
    <a className="pdmat-download__qr" href={url} target="_blank" rel="noreferrer" aria-label={qrAriaLabel}>
      <NativeQrCode value={url} label={qrAriaLabel} />
    </a>
    <i className="pdmat-download__divider" aria-hidden="true" />
    <div className="pdmat-download__copy">
      <p className="pdmat-download__eyebrow">{eyebrow}</p>
      <h2 className="pdmat-download__title">{title}</h2>
      <p className="pdmat-download__description">{description}</p>
      <p className="pdmat-download__prompt">{teamPrompt}</p>
      <ul className="pdmat-download__actions">{actions.map((action) => <li key={action}>{action}</li>)}</ul>
    </div>
    <a className="pdmat-download__cta" href={url} target="_blank" rel="noreferrer">
      <ArrowRight aria-hidden="true" size={34} strokeWidth={2} />
      <span>{ctaLabel}</span>
    </a>
  </section>;
}

export function EmbeddedAppFrame({ label, children }: { label: string; children: ReactNode }) {
  const isolateKeys = (event: KeyboardEvent<HTMLDivElement>) => event.stopPropagation();
  return <section className="pdmat-app-frame" aria-label={label}>
    <div className="pdmat-app-frame__bar" aria-hidden="true"><i /><i /><i /></div>
    <div className="pdmat-app-frame__viewport" onKeyDown={isolateKeys}>{children}</div>
  </section>;
}

export type FlowRailStep = { key: string; number?: string; circle: ReactNode; title: string; body?: string; emphasis?: boolean };
export function FlowRail({ steps, variant, className = "" }: { steps: readonly FlowRailStep[]; variant: "process" | "rail"; className?: string }) {
  return <ol className={`pdmat-rail pdmat-rail--${variant} pdmat-rail--${steps.length}-steps ${className}`.trim()}>
    {steps.map((step, index) => <li key={step.key} className={`pdmat-rail__step${step.emphasis ? " is-emphasis" : ""}`}>
      {step.number && <span className="pdmat-rail__number">{step.number}</span>}
      <span className="pdmat-rail__circle">{step.circle}</span>
      <span className="pdmat-rail__copy"><strong className="pdmat-rail__title">{step.title}</strong>{step.body && <span className="pdmat-rail__body">{step.body}</span>}</span>
      {index < steps.length - 1 && <span className="pdmat-rail__connector"><Connector kind={variant === "rail" ? "rail" : "glyph"} /></span>}
    </li>)}
  </ol>;
}

type IconCircleTone = "neutral" | "light" | "accent";
export function IconCircle({ source, glyph, size, iconSize, tone = "neutral", glow = false, className = "" }: { source?: IconSource; glyph?: string; size: number; iconSize?: number; tone?: IconCircleTone; glow?: boolean; className?: string }) {
  const inner = iconSize ?? Math.round(size * 0.46);
  let content = null;
  if (glyph) content = <span className="pdmat-icon-circle__glyph">{glyph}</span>;
  else if (source && "icon" in source) { const Icon = source.icon; content = <Icon aria-hidden="true" size={inner} strokeWidth={1.8} />; }
  else if (source) content = <img src={source.src} alt="" width={inner} height={inner} />;
  return <span className={`pdmat-icon-circle pdmat-icon-circle--${tone}${glow ? " is-glow" : ""} ${className}`.trim()} style={{ "--pdmat-circle": `${size}px`, "--pdmat-icon": `${inner}px` } as CSSProperties}>{content}</span>;
}

export function TakeawayBand({ text, aside, tone = "plain", className = "" }: { text: string; aside?: string; tone?: "plain" | "boxed"; className?: string }) {
  return <div className={`pdmat-takeaway pdmat-takeaway--${tone} ${className}`.trim()}>
    <i className="pdmat-takeaway__accent" aria-hidden="true" />
    <p className="pdmat-takeaway__text">{text}</p>
    {aside && <p className="pdmat-takeaway__aside">{aside}</p>}
  </div>;
}
