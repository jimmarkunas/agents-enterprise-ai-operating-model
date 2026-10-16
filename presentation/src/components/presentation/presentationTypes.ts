import type { LucideIcon } from "lucide-react";

/** The single 1920×1080 semantic plane shared by the PDMA deck and template gallery. */
export const PDMA_LOGICAL_CANVAS = { width: 1920, height: 1080 } as const;
export const PRESENTATION_LOGICAL_CANVAS = PDMA_LOGICAL_CANVAS;

/** Title-block configuration consumed by PresentationTitleBlock (title/subtitle styling lives in the shell). */
export type PdmaTitleConfig = {
  white?: string; magenta?: string; subtitle?: string; size: number; leading?: number; tracking?: number;
  subtitleSize?: number; subtitleLeading?: number; subtitleOffset?: number; subtitleX?: number; subtitleTracking?: number;
  exactSubtitleSize?: boolean; titleColor?: string; subtitleColor?: string; magentaRowShift?: number; magentaX?: number; sameRow?: boolean; plusMagenta?: boolean;
  /** Characters of `white` drawn in magenta (e.g. "A.S" for the A.G.E.N.T.S. wordmark). */
  magentaGlyphs?: string;
};

export type PdmaHeaderLabels = readonly [string, string, string];
export type PresentationHeaderLabels = PdmaHeaderLabels;
export type PresentationTitleConfig = PdmaTitleConfig;

export type PdmaSlideKey = `slide-${"01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10" | "11" | "12" | "13" | "14" | "15" | "16"}`;

/** Chrome contract between a deck manifest and PresentationShell. */
export type PdmaSlideManifestEntry = {
  key: PdmaSlideKey;
  id: PdmaSlideKey;
  tocTitle: string;
  headerLabels: PdmaHeaderLabels;
  footerLabel: string;
  title: PdmaTitleConfig;
  assets: readonly string[];
  routeLinks?: readonly string[];
};

/** Generic shared manifest contract used by gallery views that are not deck-keyed. */
export type PresentationSlideManifestEntry<Key extends string = string> = {
  key: Key;
  id: Key;
  tocTitle: string;
  headerLabels: PresentationHeaderLabels;
  footerLabel: string;
  title: PresentationTitleConfig;
  assets: readonly string[];
  routeLinks?: readonly string[];
};

/** Shell chrome for one production slide (same contract the template gallery uses). */
export type PdmaSlideChrome = {
  tocTitle: string;
  headerLabels: PdmaHeaderLabels;
  footerLabel: string;
  title: PdmaTitleConfig;
  sourceSlide: number | null;
};

export type TemplateKind =
  | "title"
  | "end-card"
  | "exercise"
  | "embedded-app"
  | "compare-contrast"
  | "flow-scenario"
  | "decision-spectrum"
  | "hub-ecosystem"
  | "scorecard"
  | "structured-content-action";

/** Decoration is selected by variant; template body structure never changes with it. */
export type DecorativeVariant =
  | "title-hero"
  | "end-card-orb"
  | "compare-edge-planets"
  | "flow-dual-orbs"
  | "spectrum-horizon"
  | "hub-corner-orbs"
  | "structured-dual-orbs"
  | "embedded-dual-orbs"
  | "none";

/** Shell chrome for one template slide. Consumed unchanged by PresentationShell. */
export type TemplateChrome = {
  tocTitle: string;
  headerLabels: PdmaHeaderLabels;
  footerLabel: string;
  title: PdmaTitleConfig;
  /** Live PDMA slide that owns this template's copy; null when the approved concept owns it. */
  sourceSlide: number | null;
};

type TemplateBase<K extends TemplateKind> = {
  kind: K;
  chrome: TemplateChrome;
  decorativeVariant: DecorativeVariant;
};

export type IconSource = { icon: LucideIcon } | { src: string };

export type TitleTemplateContent = TemplateBase<"title"> & {
  speaker: { name: string; role: string };
};

export type EndCardTemplateContent = TemplateBase<"end-card"> & {
  statement: { lead: string; emphasis: string };
  download: {
    /** Single destination consumed by both the QR code and the round CTA. */
    url: string;
    eyebrow: string;
    title: string;
    description: string;
    teamPrompt: string;
    actions: readonly string[];
    ctaLabel: string;
    qrAriaLabel: string;
  };
};

export type ExerciseRow = { number: string; title: string; body: string; glyph: string; emphasis: boolean };

export type ExerciseTemplateContent = TemplateBase<"exercise"> & {
  rows: readonly ExerciseRow[];
  supportingLabel: string;
  connectorArt: string;
  worksheet: {
    href: string;
    ariaLabel: string;
    brand: string;
    status: string;
    eyebrow: string;
    title: string;
    fields: readonly string[];
    footerLead: string;
    footerBrand: string;
  };
  takeaway: string;
};

export type EmbeddedAppTemplateContent = TemplateBase<"embedded-app"> & {
  frameLabel: string;
};

export type CompareProcessStep = { glyph: string; label: string };
export type ComparePanel = {
  heading: string;
  descriptor: string;
  steps: readonly CompareProcessStep[];
  accentIndex: number;
  boundary: string;
  capabilities?: readonly string[];
  tone: "neutral" | "accent";
};

export type CompareContrastTemplateContent = TemplateBase<"compare-contrast"> & {
  panels: readonly [ComparePanel, ComparePanel];
  takeaway: string;
};

export type FlowSignal = { title: string; body: string } & IconSource;
export type FlowStage = { title: string; body: string } & IconSource;

export type FlowScenarioTemplateContent = TemplateBase<"flow-scenario"> & {
  synopsis: {
    label: string;
    body: string;
    valueLabel: string;
    primaryValue: string;
    supportingValue: string;
  } & IconSource;
  signals: readonly FlowSignal[];
  stages: readonly [FlowStage, FlowStage];
  question: { label: string; body: string; followUp?: string } & IconSource;
  takeaway: string;
};

export type SpectrumStage = { number: string; title: string; body: string; active: boolean; lift: number } & IconSource;

export type DecisionSpectrumTemplateContent = TemplateBase<"decision-spectrum"> & {
  stages: readonly SpectrumStage[];
  progression: readonly string[];
  takeaway: string;
};

export type HubCard = { title: string; body: string } & IconSource;

export type HubEcosystemTemplateContent = TemplateBase<"hub-ecosystem"> & {
  inventory: { heading: string; cards: readonly HubCard[] };
  core: { heading: string; label: string; emphasis: string };
  owners: { heading: string; cards: readonly HubCard[] };
  caption: readonly [string, string];
};

export type ScorecardColumn = { title: string; question: string; rows: readonly string[] };

export type ScorecardTemplateContent = TemplateBase<"scorecard"> & {
  decisionRule: { label: string; rule: string; supporting: string };
  columns: readonly ScorecardColumn[];
  highlight: { column: number; row: number };
  takeaway: string;
};

export type StructuredRequirement = { number: string; title: string; body: string; emphasis: boolean } & IconSource;
export type StructuredStep = { number: string; title: string; body: string; emphasis: boolean } & IconSource;

export type StructuredActionTemplateContent = TemplateBase<"structured-content-action"> & {
  requirements: readonly StructuredRequirement[];
  sectionLabel: string;
  steps: readonly StructuredStep[];
  takeaway: string;
  supportingTakeaway: string;
};

export type TemplateContent =
  | TitleTemplateContent
  | EndCardTemplateContent
  | ExerciseTemplateContent
  | EmbeddedAppTemplateContent
  | CompareContrastTemplateContent
  | FlowScenarioTemplateContent
  | DecisionSpectrumTemplateContent
  | HubEcosystemTemplateContent
  | ScorecardTemplateContent
  | StructuredActionTemplateContent;

export type TemplateContentOf<K extends TemplateKind> = Extract<TemplateContent, { kind: K }>;
