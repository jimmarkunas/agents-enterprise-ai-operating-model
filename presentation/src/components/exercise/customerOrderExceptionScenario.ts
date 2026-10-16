import { customerOrderException } from "@/content/scenarios/customerOrderException";

/*
 * Customer Order Exception Agent scenario — shared pure state + scoring.
 * Moved verbatim from SecureCarolinasScenarioExercise so the Secure Carolinas deck and the
 * PDMA exercise run one implementation of the foundation, decision, and profile rules.
 */

export type Status = "DEFINED" | "PARTIAL" | "UNCLEAR";
export type FoundationAnswer = "YES" | "NO" | null;
export type ScenarioControl = typeof customerOrderException.controls[number];
export type ScenarioControlLetter = ScenarioControl["letter"];
export type ScenarioControlChoice = ScenarioControl["choices"][number];
export type ScenarioBusinessValue = typeof customerOrderException.businessValue.options[number];
export type OperatingProfileField = "AUTONOMY" | "HUMAN LOAD" | "OPERATIONAL RISK";
export type OperatingProfileLevel = "LOW" | "MODERATE" | "HIGH";
type ScenarioProfileChoice = {
  autonomy?: OperatingProfileLevel;
  humanLoad?: OperatingProfileLevel;
  operationalRisk?: OperatingProfileLevel;
};
export type ScenarioState = {
  systemsInventory: FoundationAnswer;
  ownershipDefined: FoundationAnswer;
  businessValue: ScenarioBusinessValue | null;
  selections: Partial<Record<ScenarioControlLetter, ScenarioControlChoice>>;
};

export const scenario = customerOrderException;
export const SCENARIO_STEP_COUNT = 9;
export const initialState: ScenarioState = {
  systemsInventory: null,
  ownershipDefined: null,
  businessValue: null,
  selections: {},
};
const levelValue: Record<OperatingProfileLevel, number> = { LOW: 0, MODERATE: 1, HIGH: 2 };
const levelLabel: Record<number, OperatingProfileLevel> = { 0: "LOW", 1: "MODERATE", 2: "HIGH" };
const profileFieldKeyMap: Record<OperatingProfileField, "autonomy" | "humanLoad" | "operationalRisk"> = {
  AUTONOMY: "autonomy",
  "HUMAN LOAD": "humanLoad",
  "OPERATIONAL RISK": "operationalRisk",
};

export function getControlStatusTitle(status: Status) {
  if (status === "DEFINED") return "DEFINED";
  if (status === "PARTIAL") return "PARTIAL";
  return "UNCLEAR";
}

export function getDecisionFromState(state: ScenarioState) {
  if (state.systemsInventory === null || state.ownershipDefined === null || state.businessValue === null) return "INCOMPLETE" as const;
  if (state.systemsInventory === "NO" || state.ownershipDefined === "NO") return "NO GO" as const;
  const statuses = scenario.controls.map((control) => state.selections[control.letter]?.resultingStatus);
  if (statuses.some((status) => status === undefined)) return "INCOMPLETE" as const;
  if (statuses.includes("UNCLEAR")) return "NO GO" as const;
  if (statuses.includes("PARTIAL")) return "GO WITH CONDITIONS" as const;
  return "GO" as const;
}

export function getOperatingProfile(state: ScenarioState) {
  return scenario.profileFields.map((field) => {
    const key = profileFieldKeyMap[field];
    const samples = scenario.controls
      .map((control) => {
        const choice = state.selections[control.letter];
        if (!choice) return undefined;
        return (choice as ScenarioProfileChoice)[key];
      })
      .filter((value): value is OperatingProfileLevel => value !== undefined);

    if (samples.length === 0) return { field, value: "—" as const, average: null };
    const average = samples.reduce((sum, level) => sum + levelValue[level], 0) / samples.length;
    return { field, value: levelLabel[Math.max(0, Math.min(2, Math.round(average)))], average };
  });
}

export type ScenarioDecision = ReturnType<typeof getDecisionFromState>;
