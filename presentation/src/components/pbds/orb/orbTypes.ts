export type InteractionMode = "repel" | "attract" | "swirl";
export type CropPosition = "center" | "orb-right" | "orb-left" | "orb-horizon";
export type OrbSkinStyle = "canonical-magenta" | "canonical-white" | "obsidian-ice" | "custom";

export interface PBDSKineticSphereProps {
  /** Preserve the historical embed spring-in; presentations use a settled surface. */
  initialMotion?: "settled" | "spring-in";
  centerOffsetX?: number;
  centerOffsetY?: number;
  radius?: number;
  interactionMode?: InteractionMode;
  interactionStrength?: number;
  autoRotateSpeed?: number;
  cropPosition?: CropPosition;
  skinStyle?: OrbSkinStyle;
  accentColor?: string;
  primaryDotColor?: string;
  shadowDotColor?: string;
  className?: string;
  interactive?: boolean;
  plasmaNoiseIntensity?: number;
  /** Multiplier for plasma/solar-flare angular motion. 1 preserves the default speed. */
  plasmaSpeed?: number;
  stippleDensity?: number;
  surfaceDensityScale?: number;
  surfaceClipToSilhouette?: boolean;
  ambientLuminance?: number;
  glowingStrokeIntensity?: number;
  glowSpread?: number;
  coreHotness?: number;
  innerWashIntensity?: number;
  dotHarmonization?: "unified" | "subtle-specular" | "split-tone";
  strokeMode?: "crescent" | "tapered" | "full" | "none";
  strokeShadowOpacity?: number;
  strokeWidth?: number;
  bodyOpacity?: number;
  /** Atmospheric-limb pass colors (color only; alpha/geometry/coreHotness unchanged). Unset → accent glow color. */
  outerGlowColor?: string;
  midGlowColor?: string;
  hotCoreColor?: string;
  /** Scales the existing plasma's brightness, size and outward reach. 1 = current output; practical 0.5–1.5. */
  solarFlareIntensity?: number;
  /** Optional Canvas-2D orbital system; unset preserves the Phase-1 renderer exactly. */
  orbitalSystem?: {
    enabled?: boolean;
    ringStyle?: "particles" | "solid";
    ringRadius?: number;
    ringTilt?: number;
    ringRoll?: number;
    ringThickness?: number;
    ringParticleCount?: number;
    ringParticleSize?: number;
    ringOpacity?: number;
    ringColor?: string;
    ringWidth?: number;
    ringGlowColor?: string;
    ringGlowSize?: number;
    orbitSpeed?: number;
    bodyCount?: number;
    bodySize?: number;
    bodyGlowSize?: number;
    bodyColor?: string;
    bodyGlowColor?: string;
  };
  /** Per-pass crescent focus (1 = current falloff; higher = tighter around the lit peak, energy-preserving). */
  outerGlowFocus?: number;
  midGlowFocus?: number;
  hotCoreFocus?: number;
  /** Hot-core width at the lit peak, tapering with the core's falloff. 1 = current width. */
  hotCoreWidthMultiplier?: number;
  /** Limb primitive: "stroke" (default, accepted arc passes) or experimental "field" (volumetric heat field). */
  atmosphereMode?: "stroke" | "field";
  /** Field mode: radial reach of the magenta atmosphere (px), light focus, and overall heat. */
  atmosphereWidth?: number;
  atmosphereFocus?: number;
  atmosphereIntensity?: number;
  /** Optional experiment-only inside-edge field. Zero preserves the existing field output. */
  innerGlowWidth?: number;
  innerGlowIntensity?: number;
  innerGlowColor?: string;
  innerGlowFocus?: number;
  /** Draw-time sphere-surface color gradient over the existing per-dot lit-ness. Legacy (default) is unchanged. */
  surfaceColorMode?: "legacy" | "lit-gradient";
  surfaceShadowColor?: string;
  surfaceDarkColor?: string;
  surfaceMidColor?: string;
  surfaceLightColor?: string;
  surfaceHotColor?: string;
  /** Lit-ness above which color blends from surfaceLightColor toward surfaceHotColor. 1 = no hot highlight. */
  surfaceHotThreshold?: number;
}
