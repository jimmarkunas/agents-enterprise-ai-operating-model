"use client";

import { useCallback, useState } from "react";

export type GuidedExerciseView = "intro" | "assessment" | "result";

type GuidedExerciseFlowOptions = {
  stepCount: number;
  onStart?: () => void;
  onReset?: () => void;
};

export function useGuidedExerciseFlow({ stepCount, onStart, onReset }: GuidedExerciseFlowOptions) {
  const [view, setView] = useState<GuidedExerciseView>("intro");
  const [stepIndex, setStepIndex] = useState(0);

  const start = useCallback(() => {
    onStart?.();
    setStepIndex(0);
    setView("assessment");
  }, [onStart]);

  const back = useCallback(() => {
    setStepIndex((current) => Math.max(0, current - 1));
  }, []);

  const next = useCallback(() => {
    setStepIndex((current) => {
      if (current >= stepCount - 1) {
        setView("result");
        return current;
      }
      return current + 1;
    });
  }, [stepCount]);

  const reset = useCallback(() => {
    onReset?.();
    setStepIndex(0);
    setView("intro");
  }, [onReset]);

  return {
    view,
    stepIndex,
    stepCount,
    start,
    back,
    next,
    reset,
    setStepIndex,
    setView,
    isFirstStep: stepIndex === 0,
    isLastStep: stepIndex === stepCount - 1,
  } as const;
}
