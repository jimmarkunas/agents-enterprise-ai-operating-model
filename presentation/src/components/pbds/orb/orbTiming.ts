/** Fixed simulation steps preserve the accepted 60 Hz motion and spring physics. */
export type OrbClock = { lastFrame: number; accumulator: number };
const FRAME_DURATION = 1000 / 60;

export function advanceOrbClock(clock: OrbClock, timestamp: number): number {
  // Bound catch-up work after a stalled frame; hidden-tab resume resets the clock.
  clock.accumulator += Math.min(50, Math.max(0, timestamp - clock.lastFrame));
  clock.lastFrame = timestamp;
  const steps = Math.min(3, Math.floor((clock.accumulator + 0.001) / FRAME_DURATION));
  clock.accumulator -= steps * FRAME_DURATION;
  return steps;
}
