"use client";

import { PBDSKineticSphere } from "./PBDSKineticSphere";
import { orbPresets, type PBDSOrbPresetName } from "./orbPresets";
import type { PBDSKineticSphereProps } from "./orbTypes";

export type PBDSOrbProps = PBDSKineticSphereProps & { preset: PBDSOrbPresetName };

/** Public PBDS orb: preset first, explicit props second. Rendering lives only in PBDSKineticSphere. */
export function PBDSOrb({ preset, ...overrides }: PBDSOrbProps) {
  const explicit = Object.fromEntries(Object.entries(overrides).filter(([, value]) => value !== undefined));
  return <PBDSKineticSphere {...orbPresets[preset]} {...explicit} />;
}
