import {
  BarChart3,
  Box,
  ChartColumn,
  Check,
  CircleHelp,
  ClipboardList,
  Database,
  Eye,
  FileText,
  GitBranch,
  Headset,
  Layers3,
  Lightbulb,
  Link,
  Settings,
  Shield,
  UserRound,
  UsersRound,
  Zap,
} from "lucide-react";
import type {
  CompareContrastTemplateContent,
  DecisionSpectrumTemplateContent,
  EmbeddedAppTemplateContent,
  EndCardTemplateContent,
  ExerciseTemplateContent,
  FlowScenarioTemplateContent,
  HubEcosystemTemplateContent,
  ScorecardTemplateContent,
  StructuredActionTemplateContent,
  TitleTemplateContent,
} from "@/components/presentation/presentationTypes";
import type {
  AgentsRevealContent,
  AmbiguityGateContent,
  FrameworkToProductContent,
  IdeaToSpecContent,
  ShiftBoundaryContent,
  WorkMapContent,
} from "./presentationTypes";

/*
 * PDMA 2026 production deck — the single source of presentation copy for /pdma2026.
 * Ten slides use approved template compositions; six keep their approved production
 * composition. Copy is verbatim from the pre-cutover production deck (ROLLBACK_SHA
 * 3e343570ab1957513fdf8883e2efcdaa56226a5d). The /pdma2026-templates gallery consumes the
 * template-mapped objects below as its exemplar content.
 */

const standardTitle = { size: 82, leading: 88, tracking: -2.4 } as const;
const lines = (...values: string[]) => values.join("\n");
const S = (slide: string, file: string) => `./pdma2026-2/${slide}/${file}`;

/** Slide 16 destination. The End Card QR and round CTA both read this value. */
export const PDMA_KIT_URL = "https://github.com/jimmarkunas/agents-enterprise-ai-operating-model";
/** Slide 14 worksheet destination. */
export const PDMA_EXERCISE_ROUTE = "#exercise";

// 01 — THE NEW PM OPERATING SYSTEM · Title template
export const slide01: TitleTemplateContent = {
  kind: "title",
  decorativeVariant: "title-hero",
  chrome: {
    sourceSlide: 1,
    tocTitle: "THE NEW PM OPERATING SYSTEM",
    headerLabels: ["JUDGMENT", "AUTHORITY", "ACCOUNTABILITY"],
    footerLabel: "HUMAN JUDGMENT COMPOUNDS",
    title: { white: "THE NEW PM", magenta: "OPERATING SYSTEM", subtitle: lines("What stays uniquely human.", "What shifts to AI."), size: 82, leading: 88, tracking: -2.4, subtitleSize: 30, subtitleLeading: 36 },
  },
  speaker: { name: "Jim Markunas", role: "Head of Product, Bytalos" },
};

// 02 — WHAT SHIFTS. WHAT STAYS. · preserved production composition
export const slide02: ShiftBoundaryContent = {
  kind: "shift-boundary",
  chrome: {
    sourceSlide: 2,
    tocTitle: "WHAT SHIFTS. WHAT STAYS.",
    headerLabels: ["OWNERSHIP", "JUDGMENT", "AUTOMATION"],
    footerLabel: "DELEGATED WORK • HUMAN JUDGMENT",
    title: { ...standardTitle, white: "WHAT SHIFTS.", magenta: "WHAT STAYS.", subtitle: "AI automates the grunt work. It does not change who owns the product outcome.", subtitleSize: 30, subtitleLeading: 36 },
  },
  lists: [
    { side: "ai", heading: "SHIFTS TO AI", items: [{ label: "Search & synthesis", glyph: S("slide-02", "icon-search.svg") }, { label: "Drafting & analysis", glyph: S("slide-02", "icon-drafting.svg") }, { label: "Monitoring & coordination", glyph: S("slide-02", "icon-monitoring.svg") }] },
    { side: "human", heading: "STAYS HUMAN", items: [{ label: "Product ownership", glyph: S("slide-02", "icon-ownership.svg") }, { label: "Priority & tradeoffs", glyph: S("slide-02", "icon-tradeoffs.svg") }, { label: "Authority & escalation", glyph: S("slide-02", "icon-authority.svg") }] },
  ],
  boundary: [
    [{ text: "THE BOUNDARY IS NOT " }, { text: "HUMAN VS. AI.", emphasis: true }],
    [{ text: "IT’S " }, { text: "DELEGATED WORK VS.", emphasis: true }, { text: " " }, { text: "HUMAN JUDGMENT.", emphasis: true }],
  ],
};

// 03 — COPILOTS GENERATE OUTPUTS. AGENTS TAKE ACTION. · Compare / Contrast template
export const slide03: CompareContrastTemplateContent = {
  kind: "compare-contrast",
  decorativeVariant: "compare-edge-planets",
  chrome: {
    sourceSlide: 3,
    tocTitle: "COPILOTS GENERATE OUTPUTS. AGENTS TAKE ACTION.",
    headerLabels: ["OUTPUTS", "AUTHORITY", "ACTION"],
    footerLabel: "AUTHORITY IS A PRODUCT DECISION",
    title: { ...standardTitle, white: "COPILOTS GENERATE OUTPUTS.", magenta: "AGENTS TAKE ACTION.", subtitle: lines("When AI can act in enterprise systems, product design must account for", "authority, consequence, and control."), subtitleSize: 29, subtitleLeading: 42 },
  },
  panels: [
    {
      heading: "C O P I L O T",
      descriptor: "A S S I S T S   W I T H   O U T P U T S",
      steps: [{ glyph: "H", label: "HUMAN" }, { glyph: "P", label: "PROMPT" }, { glyph: "M", label: "MODEL" }, { glyph: "O", label: "OUTPUT" }],
      accentIndex: 3,
      boundary: "Human remains the execution boundary.",
      tone: "neutral",
    },
    {
      heading: "A G E N T",
      descriptor: "A C T S   I N   T H E   R E A L   W O R L D",
      steps: [{ glyph: "G", label: "GOAL" }, { glyph: "A", label: "AGENT" }, { glyph: "T", label: "TOOL / SYSTEM" }, { glyph: "→", label: "ACTION" }],
      accentIndex: 1,
      boundary: "AI can now cross the execution boundary.",
      capabilities: ["READ", "WRITE", "SEND", "SPEND"],
      tone: "accent",
    },
  ],
  takeaway: "WHEN AI BECOMES AN OPERATOR, AUTHORITY BECOMES A PRODUCT DECISION.",
};

// 04 — DON'T AUTOMATE EVERYTHING. · preserved production composition (PBDS north star)
export const slide04: WorkMapContent = {
  kind: "work-map",
  chrome: {
    sourceSlide: 4,
    tocTitle: "DON'T AUTOMATE EVERYTHING.",
    headerLabels: ["AUTOMATE", "AUGMENT", "HUMAN-OWNED"],
    footerLabel: "BUILD THE RIGHT OPERATING MODEL",
    title: { ...standardTitle, white: "DON'T AUTOMATE", magenta: "EVERYTHING.", subtitle: lines("Decide what problem deserves automation,", "what outcome matters, and what tradeoffs you’re willing to accept."), subtitleSize: 31, subtitleLeading: 40 },
  },
  modes: [
    { number: "01", title: "AUTOMATE", body: "AI owns execution of bounded, repeatable work.", label: "EXECUTION" },
    { number: "02", title: "AUGMENT", body: "AI improves speed, synthesis, or quality while a human still decides.", label: "DECISION" },
    { number: "03", title: "HUMAN-OWNED", body: "Judgment, accountability, and authority stays human.", label: "ACCOUNTABILITY" },
  ],
  takeaway: "THE GOAL: BUILD THE RIGHT OPERATING MODEL FOR THE WORK.",
};

// 05 — DON'T AUTOMATE AMBIGUITY. · HERO template v1 — Centered Signal Field (approved 2026-09-24)
export const slide05: AmbiguityGateContent = {
  kind: "ambiguity-gate",
  chrome: {
    sourceSlide: 5,
    tocTitle: "DON'T AUTOMATE AMBIGUITY.",
    headerLabels: ["PROBLEM", "OWNER", "AUTHORITY"],
    footerLabel: "CONFUSION AT MACHINE SPEED",
    title: { size: 131, leading: 129, tracking: -9.5, white: "DON'T AUTOMATE", magenta: "AMBIGUITY." },
  },
  conditions: ["UNCLEAR PROBLEM.", "UNCLEAR OWNER.", "UNCLEAR AUTHORITY."],
  equals: "=",
  result: "CONFUSION AT\nMACHINE SPEED.",
};

// 06 — UNDERSTAND THE ENVIRONMENT. NAME THE OWNERS. · Hub / Ecosystem template
export const slide06: HubEcosystemTemplateContent = {
  kind: "hub-ecosystem",
  decorativeVariant: "hub-corner-orbs",
  chrome: {
    sourceSlide: 6,
    tocTitle: "UNDERSTAND THE ENVIRONMENT. NAME THE OWNERS.",
    headerLabels: ["SYSTEMS", "DATA", "OWNERSHIP"],
    footerLabel: "AUTOMATION DOES NOT ERASE OWNERSHIP",
    title: { white: "UNDERSTAND THE ENVIRONMENT.", magenta: "NAME THE OWNERS.", subtitle: "Before you automate, inventory the environment and assign human accountability.", size: 64, leading: 70, tracking: 0, subtitleSize: 29, subtitleLeading: 36, subtitleOffset: 17, subtitleX: 0, subtitleTracking: 0, exactSubtitleSize: true, titleColor: "#f2f2f2", subtitleColor: "#f2f2f2", magentaRowShift: -2 },
  },
  inventory: {
    heading: "DO THE INVENTORY",
    cards: [
      { title: "SYSTEMS", body: "Applications, infrastructure, tools\nand integrations.", icon: Layers3 },
      { title: "DATA", body: "Sources, types, sensitivity\nand quality.", icon: Database },
      { title: "PEOPLE", body: "Teams, roles, skills\nand working models.", icon: UsersRound },
      { title: "DEPENDENCIES", body: "Upstream, downstream\nand external partners.", icon: Link },
    ],
  },
  core: { heading: "AUTOMATION", label: "AI / AUTOMATION", emphasis: "AI" },
  owners: {
    heading: "NAME THE OWNERS",
    cards: [
      { title: "SYSTEM OWNER", body: "Accountable for reliability,\nsecurity and lifecycle.", icon: UserRound },
      { title: "DECISION OWNER", body: "Accountable for policies,\ntrade-offs and approvals.", icon: FileText },
      { title: "OUTCOME OWNER", body: "Accountable for value,\nresults and continuous improvement.", icon: BarChart3 },
    ],
  },
  caption: ["MORE AWARENESS", "BETTER AUTONOMY"],
};

// 07 — BEFORE YOU BUILD IT, PROVE THE VALUE. · Scorecard template
export const slide07: ScorecardTemplateContent = {
  kind: "scorecard",
  decorativeVariant: "none",
  chrome: {
    sourceSlide: 7,
    tocTitle: "BEFORE YOU BUILD IT, PROVE THE VALUE.",
    headerLabels: ["REVENUE", "COST", "OPERATIONS"],
    footerLabel: "PICK ONE PRIMARY VALUE DRIVER",
    title: { ...standardTitle, white: "BEFORE YOU BUILD IT,", magenta: "PROVE THE VALUE.", subtitle: "Every Agentic Product should have a clear economic reason to exist. Pick one primary value driver.", subtitleSize: 27, subtitleLeading: 36 },
  },
  decisionRule: {
    label: "DECISION RULE",
    rule: "PICK ONE\nPRIMARY\nVALUE DRIVER.",
    supporting: "Use this scorecard to\nevaluate your concept.\nA strong product should\nclearly map to one\nprimary value driver.",
  },
  columns: [
    { title: "INCREASE REVENUE", question: "Does it help us grow top-line value?", rows: ["ACQUIRE", "CONVERT", "RETAIN", "EXPAND"] },
    { title: "DECREASE COST", question: "Does it remove meaningful cost\nfrom the system?", rows: ["LABOR", "COST-TO-SERVE", "REWORK", "WASTE"] },
    { title: "STREAMLINE OPERATIONS", question: "Does it make work materially\neasier to run?", rows: ["FASTER", "SIMPLER", "SCALABLE", "LESS MANUAL"] },
  ],
  highlight: { column: 0, row: 0 },
  takeaway: "IF YOU CAN'T IDENTIFY ONE OF THESE OUTCOMES, YOU DON'T HAVE A PRODUCT.",
};

// 08 — HOW MUCH AUTHORITY SHOULD THE ROBOTS HAVE? · Decision / Spectrum template
export const slide08: DecisionSpectrumTemplateContent = {
  kind: "decision-spectrum",
  decorativeVariant: "spectrum-horizon",
  chrome: {
    sourceSlide: 8,
    tocTitle: "HOW MUCH AUTHORITY SHOULD THE ROBOTS HAVE?",
    headerLabels: ["OBSERVE", "DECIDE", "EXECUTE"],
    footerLabel: "AUTHORITY IS A PRODUCT DECISION",
    title: { ...standardTitle, white: "HOW MUCH AUTHORITY", magenta: "SHOULD THE ROBOTS HAVE?", subtitle: lines("The farther AI moves from observing to acting, the more deliberately", "the Product Manager has to design the boundary."), subtitleSize: 26 },
  },
  stages: [
    { number: "01", title: "OBSERVE", body: "AI sees the state\nof the product\nor process.", active: false, lift: 0, icon: Eye },
    { number: "02", title: "RECOMMEND", body: "AI proposes what\nshould happen.", active: false, lift: 105, icon: FileText },
    { number: "03", title: "PREPARE", body: "AI stages the action\nfor human review.", active: false, lift: 145, icon: Settings },
    { number: "04", title: "DECIDE", body: "AI chooses the action\nwithin defined rules.", active: true, lift: 105, icon: GitBranch },
    { number: "05", title: "EXECUTE", body: "AI acts within\ndefined limits.", active: true, lift: 0, icon: Zap },
  ],
  progression: ["MORE AUTONOMY", "MORE CONSEQUENCE", "MORE PRODUCT DESIGN"],
  takeaway: "THE FARTHER RIGHT YOU GO, THE MORE PRODUCT DESIGN HAS TO ACCOUNT FOR THE CONSEQUENCES.",
};

// 09 — LIVE SCENARIO: RETENTION AGENT. · Flow / Scenario template
export const slide09: FlowScenarioTemplateContent = {
  kind: "flow-scenario",
  decorativeVariant: "flow-dual-orbs",
  chrome: {
    sourceSlide: 9,
    tocTitle: "LIVE SCENARIO: RETENTION AGENT.",
    headerLabels: ["VALUE", "SIGNAL", "ACTION"],
    footerLabel: "PRODUCTION-READY ENTERPRISE PRODUCT",
    title: { ...standardTitle, white: "LIVE SCENARIO:", magenta: "RETENTION AGENT.", subtitle: "A real enterprise business case: detect churn risk across CRM, product-usage, and support data before it is too late to act.", subtitleSize: 29 },
  },
  synopsis: {
    label: "BUSINESS PROBLEM",
    body: "Customer retention teams spend too much time manually identifying churn risk across fragmented enterprise systems.",
    valueLabel: "PRIMARY VALUE DRIVER",
    primaryValue: "INCREASE REVENUE",
    supportingValue: "+ STREAMLINE OPERATIONS",
    icon: FileText,
  },
  signals: [
    { title: "CRM", body: "Customer data", icon: UsersRound },
    { title: "PRODUCT USAGE", body: "Behavioral data", icon: BarChart3 },
    { title: "SUPPORT", body: "Support tickets", icon: Headset },
    { title: "ACCOUNT HEALTH", body: "Billing & health data", icon: Database },
  ],
  stages: [
    { title: "IDENTIFY", body: "Detect meaningful churn-risk patterns across enterprise customer data.", icon: ChartColumn },
    { title: "RECOMMEND", body: "Recommend an approved intervention to the responsible team.", icon: Lightbulb },
  ],
  question: { label: "PRODUCT QUESTION", body: "How much authority should this agent have?", followUp: "How do we turn this business case into a production-ready enterprise product?", icon: CircleHelp },
  takeaway: "HOW DO WE TURN THIS BUSINESS CASE INTO A PRODUCTION-READY ENTERPRISE PRODUCT?",
};

// 10 — DESIGN PRODUCTION READINESS INTO THE FEATURE. · Structured Content / Action template
export const slide10: StructuredActionTemplateContent = {
  kind: "structured-content-action",
  decorativeVariant: "structured-dual-orbs",
  chrome: {
    sourceSlide: 10,
    tocTitle: "DESIGN PRODUCTION READINESS INTO THE FEATURE.",
    headerLabels: ["BACKLOG", "CONTROLS", "OUTCOMES"],
    footerLabel: "PRODUCTION READINESS STARTS IN THE BACKLOG",
  title: { ...standardTitle, white: "DESIGN PRODUCTION READINESS", magenta: "INTO THE FEATURE.", subtitle: "Guardrails, human intervention, and success measures belong in the product requirements before development begins.", subtitleSize: 24 },
  },
  requirements: [
    { number: "01", title: "GUARDRAILS", body: "What must the product\nprevent or constrain?", emphasis: false, icon: Shield },
    { number: "02", title: "HUMAN INTERVENTION", body: "When must a person review,\napprove, or take over?", emphasis: true, icon: UserRound },
    { number: "03", title: "SUCCESS METRICS", body: "What proves the feature\ncreates the intended\noutcome?", emphasis: false, icon: BarChart3 },
  ],
  sectionLabel: "OPERATIONALIZE IT AS PRODUCT WORK",
  steps: [
    { number: "01", title: "BACKLOG", body: "Capture the requirements.", emphasis: false, icon: ClipboardList },
    { number: "02", title: "PRD", body: "Define behavior and\nboundaries.", emphasis: false, icon: FileText },
    { number: "03", title: "ACCEPTANCE CRITERIA", body: "Make them testable.", emphasis: false, icon: Check },
    { number: "04", title: "PRODUCTION", body: "Prove they work.", emphasis: true, icon: Box },
  ],
  takeaway: "IF IT MATTERS IN PRODUCTION, IT BELONGS IN THE PRODUCT DEFINITION.",
  supportingTakeaway: "REAL FEATURES.\nREAL OUTCOMES.",
};

// 11 — A.G.E.N.T.S. · Brand / Reveal template v1 — Particle Horizon Reveal (approved 2026-09-24; first named framework reveal)
export const slide11: AgentsRevealContent = {
  kind: "agents-reveal",
  chrome: {
    sourceSlide: 11,
    tocTitle: "A.G.E.N.T.S.",
    headerLabels: ["STANDARD", "PRODUCT", "GOVERN"],
    footerLabel: "6 QUESTIONS • 1 PRODUCTIZATION STANDARD",
    title: { size: 214, leading: 200, tracking: -13.5, white: "A.G.E.N.T.S.", magentaGlyphs: "A.S", subtitle: "Six product questions that turn an Agentic AI idea\ninto something a team can safely build, test, and operate.", subtitleSize: 37, subtitleLeading: 47, subtitleOffset: 0 },
  },
  questions: [
    { letter: "A", title: "AUTHORITY", question: "What may AI\ndecide and do?" },
    { letter: "G", title: "GUARDRAILS", question: "What constraints\nmust be built into\nthe product?" },
    { letter: "E", title: "EVIDENCE", question: "What operational\nrecord must the\nproduct create?" },
    { letter: "N", title: "NETWORK &\nINTEGRATIONS", question: "What systems, data,\nand permissions\nmay it touch?" },
    { letter: "T", title: "TRANSFER &\nESCALATION", question: "When must a\nhuman intervene?" },
    { letter: "S", title: "SUCCESS &\nACCOUNTABILITY", question: "What KPI defines\nsuccess + which human\nowns the outcome?" },
  ],
};

// 12 — TURN THE FRAMEWORK INTO PRODUCT. · Translation / Traceability v1 (approved 2026-09-24)
export const slide12: FrameworkToProductContent = {
  kind: "framework-to-product",
  chrome: {
    sourceSlide: 12,
    tocTitle: "TURN THE FRAMEWORK INTO PRODUCT.",
    headerLabels: ["FRAMEWORK", "REQUIREMENTS", "PRODUCT"],
    footerLabel: "FRAMEWORK → REQUIREMENTS → BUILDABLE PRODUCT",
    title: { ...standardTitle, white: "TURN THE FRAMEWORK", magenta: "INTO PRODUCT.", subtitle: "A.G.E.N.T.S. changes how you write your backlog.", size: 85, leading: 78, tracking: -1, subtitleSize: 29.8, subtitleLeading: 36, subtitleOffset: 7 },
  },
  framework: {
    heading: "A.G.E.N.T.S FRAMEWORK",
    rows: [{ letter: "A", label: "Authority" }, { letter: "G", label: "Guardrails" }, { letter: "E", label: "Evidence" }, { letter: "N", label: "Network & Integrations" }, { letter: "T", label: "Transfer & Escalation" }, { letter: "S", label: "Success & Accountability" }],
  },
  requirements: {
    heading: "PRODUCT REQUIREMENTS",
    rows: [
      { letter: "A", requirement: "The agent may recommend a retention intervention, but cannot publish or launch it." },
      { letter: "G", requirement: "Recommendations must stay within approved product surfaces and business rules." },
      { letter: "E", requirement: "Keep a clear record of the recommendation, the inputs that drove it, and the final decision." },
      { letter: "N", requirement: "Agent has read/write access to Salesforce, but cannot change customer payment data." },
      { letter: "T", requirement: "CS Lead approval is required before an agent can update a customer’s payment data." },
      { letter: "S", requirement: "Measure retention lift, recommendation accuracy, false-positive rate, and human override rate." },
    ],
  },
};

// 13 — AN IDEA + AI ≠ PRODUCT SPEC. · approved v1 composition (2026-09-24)
export const slide13: IdeaToSpecContent = {
  kind: "idea-to-spec",
  chrome: {
    sourceSlide: 13,
    tocTitle: "AN IDEA + AI ≠ PRODUCT SPEC.",
    headerLabels: ["IDEA", "REQUIREMENTS", "PRODUCT"],
    footerLabel: "LESS REWORK • FASTER DELIVERY • HIGHER CONFIDENCE",
    title: { ...standardTitle, white: "AN IDEA + AI", magenta: "≠ PRODUCT SPEC.", subtitle: "Same starting point. Different outcomes.", size: 78, tracking: 2, subtitleSize: 33, subtitleLeading: 36, subtitleOffset: 9, sameRow: true, magentaX: 757, plusMagenta: true },
  },
  sideStatement: "CLARITY\nTURNS IDEAS\nINTO IMPACT.",
  before: {
    label: "BEFORE",
    title: "A Vague Prompt",
    quote: "“Build an AI agent that helps retain\ncustomers and recommend improvements.”",
    items: ["Unclear business value", "No operating boundaries", "Missing data and system context", "No success criteria", "High risk of rework"],
    marker: S("slide-13", "de293.svg"),
  },
  bridge: { art: S("slide-13", "f941e.svg"), label: "A.G.E.N.T.S.\nTURNS IDEAS\nINTO BUILDABLE\nPRODUCTS." },
  after: {
    label: "AFTER",
    title: "A Production-Ready Spec",
    quote: "“Build a Retention Agent that identifies statistically\nsignificant retention problems and recommends\napproved interventions.”",
    items: ["Clear business value and success metrics", "Defined authority and operating boundaries", "Identified data sources and integrations", "Evidence and decision record requirements", "Ready for build, test, and operationalize"],
    marker: S("slide-13", "a91e2.svg"),
  },
  takeaway: "SAME IDEA. COMPLETELY DIFFERENT PRODUCT.",
  outcomes: [{ value: "LESS", label: "REWORK" }, { value: "FASTER", label: "DELIVERY" }, { value: "HIGHER", label: "CONFIDENCE" }],
};

// 14 — NOW YOU DO IT. · Exercise / Worksheet template
export const slide14: ExerciseTemplateContent = {
  kind: "exercise",
  decorativeVariant: "none",
  chrome: {
    sourceSlide: 14,
    tocTitle: "NOW YOU DO IT.",
    headerLabels: ["APPLY", "DECIDE", "BUILD"],
    footerLabel: "USEFUL PM ARTIFACT • NOT JUST A QUIZ RESULT",
    title: { ...standardTitle, white: "NOW YOU", magenta: "DO IT.", subtitle: "Turn an AI idea into a mini productization brief you can take back to work.", subtitleSize: 30 },
  },
  rows: [
    { number: "01", title: "VALUE", body: "Increase revenue, decrease cost, or\nstreamline operations?", glyph: "./pdma2026-2/slide-14/66471.svg", emphasis: false },
    { number: "02", title: "AUTHORITY", body: "What may AI observe, recommend,\nprepare, decide, or execute?", glyph: "./pdma2026-2/slide-14/408a3.svg", emphasis: false },
    { number: "03", title: "A.G.E.N.T.S.", body: "Define controls, evidence, systems,\ntransfer, and success.", glyph: "./pdma2026-2/slide-14/a7ab0.svg", emphasis: false },
    { number: "04", title: "OUTPUT", body: "Generate a mini productization brief /\nbacklog-ready artifact.", glyph: "./pdma2026-2/slide-14/ea3ba.svg", emphasis: true },
  ],
  supportingLabel: "IDEAS\nTHROUGH\nSTRUCTURE\nTO IMPACT",
  connectorArt: "./pdma2026-2/slide-14/b1b9e.svg",
  worksheet: {
    href: PDMA_EXERCISE_ROUTE,
    ariaLabel: "Open the PDMA live productization exercise",
    brand: "PDMA 2026",
    status: "CONFIDENTIAL   •   DRAFT",
    eyebrow: "AI INITIATIVE",
    title: "PRODUCTIZATION BRIEF",
    fields: ["OPPORTUNITY", "VALUE", "AUTHORITY", "A.G.E.N.T.S.", "OUTPUT", "NEXT STEPS"],
    footerLead: "FROM IDEA TO IMPACT",
    footerBrand: "PDMA 2026",
  },
  takeaway: "ARE YOU READY TO PRODUCTIZE YOUR AI?",
};

// 15 — EMBEDDED APPS. REAL WORK. · Embedded App template (live PDMA scenario exercise)
export const slide15: EmbeddedAppTemplateContent = {
  kind: "embedded-app",
  decorativeVariant: "embedded-dual-orbs",
  chrome: {
    sourceSlide: null,
    tocTitle: "EMBEDDED APPS. REAL WORK.",
    headerLabels: ["APPLY", "DECIDE", "BUILD"],
    footerLabel: "USEFUL PM ARTIFACT • NOT JUST A QUIZ RESULT",
    title: { ...standardTitle, white: "EMBEDDED APPS.", magenta: "REAL WORK.", subtitle: "Put live tools, data, and workflows directly in the presentation.", subtitleSize: 30, sameRow: true, magentaX: 746 },
  },
  frameLabel: "Live PDMA productization exercise",
};

// 16 — TURN AI CAPABILITY INTO PRODUCT VALUE. · End Card template
export const slide16: EndCardTemplateContent = {
  kind: "end-card",
  decorativeVariant: "end-card-orb",
  chrome: {
    sourceSlide: 15,
    tocTitle: "TURN AI CAPABILITY INTO PRODUCT VALUE.",
    headerLabels: ["VALUE", "AUTHORITY", "ACCOUNTABILITY"],
    footerLabel: "NEVER AUTOMATE AWAY ACCOUNTABILITY",
    title: { ...standardTitle, white: "TURN AI CAPABILITY", magenta: "INTO PRODUCT VALUE.", subtitle: "Start with the business case. Define the authority. Productize the controls.\nMeasure the outcome.", subtitleSize: 30 },
  },
  statement: { lead: "AUTOMATE THE WORK.", emphasis: "NEVER AUTOMATE AWAY ACCOUNTABILITY." },
  download: {
    url: PDMA_KIT_URL,
    eyebrow: "SPECIAL GIFT FROM PDMA + JIM",
    title: "A.G.E.N.T.S. PRODUCTIZATION KIT",
    description: "A free worksheet for operationalizing this approach in your enterprise.",
    teamPrompt: "TAKE IT BACK TO YOUR TEAM.",
    actions: ["DOWNLOAD IT", "USE IT", "ADAPT IT", "SHARE IT"],
    ctaLabel: "DOWNLOAD THE KIT",
    qrAriaLabel: "Open the Agents Enterprise AI Operating Model GitHub repository",
  },
};

/** Narrative order is fixed: 16 slides, A.G.E.N.T.S. first named on Slide 11. */
export const pdma2026Slides = [
  slide01, slide02, slide03, slide04, slide05,
  slide06, slide07, slide08, slide09, slide10,
  slide11, slide12, slide13, slide14, slide15,
  slide16,
] as const;

export type Pdma2026SlideContent = (typeof pdma2026Slides)[number];
