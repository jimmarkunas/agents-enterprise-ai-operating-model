"use client";

import { EmbeddedAppFrame } from "@/components/presentation/TemplatePrimitives";
import { PresentationSlideCanvas } from "@/components/presentation/PresentationShell";
import { PdmaScenarioExercise } from "./PdmaScenarioExercise";

/**
 * Standalone rehearsal/testing container for the PDMA exercise: the same component and the
 * same EmbeddedAppFrame the deck uses, on the shell's uniformly scaled 1920×1080 plane.
 */
export function PdmaExerciseRoute() {
  return <main className="pdma-presentation">
    <div className="pdma-stage">
      <PresentationSlideCanvas>
        <div className="pdmax-route">
          <EmbeddedAppFrame label="PDMA productization exercise"><PdmaScenarioExercise /></EmbeddedAppFrame>
        </div>
      </PresentationSlideCanvas>
    </div>
  </main>;
}
