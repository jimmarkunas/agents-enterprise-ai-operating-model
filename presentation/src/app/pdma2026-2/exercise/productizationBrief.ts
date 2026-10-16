import {
  getDecisionFromState,
  getOperatingProfile,
  scenario,
  type ScenarioDecision,
  type ScenarioState,
  type Status,
} from "@/components/exercise/customerOrderExceptionScenario";

/*
 * PDMA mini productization brief — a deterministic read-out of the participant's exact
 * Secure Carolinas scenario answers. It never changes scoring or the production decision.
 */

export const briefCopy = {
  title: "MINI PRODUCTIZATION BRIEF",
  buildAction: "BUILD MY PRODUCTIZATION BRIEF",
  copyAction: "COPY BRIEF",
  copied: "COPIED",
  copyUnavailable: "COPY UNAVAILABLE",
  backToDecision: "PRODUCTION DECISION",
  sections: {
    agent: "AGENT / OPPORTUNITY",
    foundation: "FOUNDATION",
    value: "PRIMARY BUSINESS VALUE",
    decision: "PRODUCTION DECISION",
    profile: "OPERATING PROFILE",
    controls: "A.G.E.N.T.S. DECISIONS",
    conditions: "CONDITIONS / UNRESOLVED ITEMS",
    nextStep: "NEXT STEP",
  },
  foundation: { systems: "Systems inventory", ownership: "Defined ownership" },
  allClear: "All six A.G.E.N.T.S. controls are DEFINED and both foundation gates passed.",
  nextStep: {
    GO: "Ready to translate into backlog items, acceptance criteria, and operating measures.",
    "GO WITH CONDITIONS": "Resolve the listed conditions before unconstrained rollout.",
    "NO GO": "Resolve the listed blockers before production approval.",
    INCOMPLETE: "Complete every step before production approval.",
  } satisfies Record<ScenarioDecision, string>,
} as const;

/** One unresolved item: a failed foundation gate or a control that is not DEFINED. */
export type BriefCondition = { item: string; status: string; choice?: string };
export type BriefControl = { letter: string; name: string; choice: string; status: Status; description: string; tradeoff: string };
export type ProductizationBrief = {
  agent: string;
  foundation: { label: string; answer: string }[];
  businessValue: string;
  decision: ScenarioDecision;
  profile: { field: string; value: string }[];
  controls: BriefControl[];
  /** Empty when every gate passed and every control is DEFINED (see briefCopy.allClear). */
  conditions: BriefCondition[];
  nextStep: string;
};

export function buildProductizationBrief(state: ScenarioState): ProductizationBrief {
  const decision = getDecisionFromState(state);
  const controls = scenario.controls.map((control) => {
    const choice = state.selections[control.letter];
    return {
      letter: control.letter,
      name: control.name,
      choice: choice?.label ?? "—",
      status: (choice?.resultingStatus ?? "UNCLEAR") as Status,
      description: choice?.description ?? "—",
      tradeoff: choice?.tradeoff ?? "—",
    };
  });
  const foundation = [
    { label: briefCopy.foundation.systems, answer: state.systemsInventory ?? "—" },
    { label: briefCopy.foundation.ownership, answer: state.ownershipDefined ?? "—" },
  ];
  const conditions: BriefCondition[] = [
    ...foundation.filter(({ answer }) => answer === "NO").map(({ label, answer }) => ({ item: label, status: answer })),
    ...controls.filter(({ status }) => status !== "DEFINED").map(({ letter, name, status, choice }) => ({ item: `${letter} · ${name}`, status, choice })),
  ];
  return {
    agent: scenario.name,
    foundation,
    businessValue: state.businessValue ?? "—",
    decision,
    profile: getOperatingProfile(state).map(({ field, value }) => ({ field, value })),
    controls,
    conditions,
    nextStep: briefCopy.nextStep[decision],
  };
}

/** On-screen form; the frame shows each control's choice in the A–S table beside it. */
export const formatCondition = ({ item, status }: BriefCondition) => `${item} — ${status}`;

/** Plain-text clipboard version carrying the same substantive information as the brief frame. */
export function briefToText(brief: ProductizationBrief) {
  const { sections } = briefCopy;
  return [
    `PDMA 2026 — ${briefCopy.title}`,
    "",
    `${sections.agent}: ${brief.agent}`,
    `${sections.foundation}: ${brief.foundation.map(({ label, answer }) => `${label} ${answer}`).join(" · ")}`,
    `${sections.value}: ${brief.businessValue}`,
    `${sections.decision}: ${brief.decision}`,
    `${sections.profile}: ${brief.profile.map(({ field, value }) => `${field} ${value}`).join(" · ")}`,
    "",
    sections.controls,
    ...brief.controls.flatMap(({ letter, name, choice, status, description, tradeoff }) => [
      `${letter} — ${name}: ${choice} (${status})`,
      `  ${description}`,
      `  Tradeoff: ${tradeoff}`,
    ]),
    "",
    sections.conditions,
    ...(brief.conditions.length ? brief.conditions.map(({ item, status, choice }) => `- ${item} — ${status}${choice ? `: ${choice}` : ""}`) : [`- ${briefCopy.allClear}`]),
    "",
    `${sections.nextStep}: ${brief.nextStep}`,
  ].join("\n");
}
