import { useReducedMotion } from "motion/react";

export const presentationEase = "easeOut" as const;
export function usePresentationReducedMotion() { return useReducedMotion(); }
export function presentationTransition(reduced: boolean | null, duration: number, delay = 0) {
  return reduced ? { duration: 0 } : { duration, delay, ease: presentationEase };
}
