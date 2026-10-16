import type {
  GlobeAnimationRecipe,
  GlobeBodyPreset,
  GlobeColorId,
  GlobePresetId,
  GlobeSurfaceColorProfile,
  LocationTagPreset,
  LocationTagPresetId,
  OrbitPreset,
  OrbitPresetId,
} from "./globeTypes";

/** Body values transcribed from the four original MotionGlobe prop blocks. */
export const globeBodyPresets: Record<GlobePresetId, GlobeBodyPreset> = {
  "globe-1": {
    palette: { backdrop: "rgb(7, 14, 31)", ink: "rgb(201, 220, 255)", backFade: 0.14, tint: "rgb(127, 178, 255)" },
    density: "dense",
    dotSize: 5.1,
    sizeJitter: 0.35,
    coastLift: 0.4,
    spin: 0.06,
    tilt: 18,
    startLng: 21,
    zoom: 1,
    offsetX: 0,
    offsetY: -0.25,
    allowTiltDrag: true,
    tiltRange: 59,
    formation: "bloom",
    entranceSeconds: 6,
    cursorMode: "halo",
    reach: 0.3,
    waveLength: 0.22,
    waveSpeed: 0.55,
    crest: 0.035,
    swell: 1.2,
    glow: 1,
    cursorDelay: 0,
  },
  "globe-2": {
    palette: { backdrop: "#04110E", ink: "#BFF3DF", backFade: 0.13, tint: "#5EE9B5" },
    density: "balanced",
    dotSize: 10,
    sizeJitter: 0,
    coastLift: 0.15,
    spin: 0.06,
    tilt: 18,
    startLng: 21,
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
    allowTiltDrag: true,
    tiltRange: 70,
    formation: "sweep",
    entranceSeconds: 2.2,
    cursorMode: "sonar",
    reach: 0.5,
    waveLength: 0.22,
    waveSpeed: 0.55,
    crest: 0.035,
    swell: 1.2,
    glow: 1,
    cursorDelay: 0,
  },
  "globe-3": {
    palette: { backdrop: "rgba(255, 255, 255, 0.88)", ink: "rgba(126, 133, 156, 0.25)", backFade: 0.14, tint: "rgb(9, 110, 186)" },
    density: "ultra",
    dotSize: 6,
    sizeJitter: 0,
    coastLift: 0.2,
    spin: 0.02,
    tilt: 37,
    startLng: 0,
    zoom: 0.95,
    offsetX: 0,
    offsetY: -0.1,
    allowTiltDrag: false,
    tiltRange: 70,
    formation: "fall",
    entranceSeconds: 2.2,
    cursorMode: "wake",
    reach: 0.65,
    waveLength: 0.22,
    waveSpeed: 0.55,
    crest: 0.055,
    swell: 1.2,
    glow: 1.6,
    cursorDelay: 0.1,
  },
  "globe-4": {
    palette: { backdrop: "#F4F1EA", ink: "#2C3440", backFade: 0.22, tint: "#1B6FE0" },
    density: "balanced",
    dotSize: 6,
    sizeJitter: 0,
    coastLift: 0.5,
    spin: 0.09,
    tilt: 18,
    startLng: 21,
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
    allowTiltDrag: true,
    tiltRange: 70,
    formation: "instant",
    entranceSeconds: 2.2,
    cursorMode: "sonar",
    reach: 0.5,
    waveLength: 0.22,
    waveSpeed: 0.55,
    crest: 0.035,
    swell: 1.2,
    glow: 1,
    cursorDelay: 0.5,
  },
};

const labelFont: LocationTagPreset["labelFont"] = {
  fontFamily: '"Inter", "Inter Placeholder", sans-serif',
  fontSize: 16,
  fontWeight: 400,
  letterSpacing: "0em",
  lineHeight: "1em",
};

/** Marker and label treatments remain independently composable with globe bodies. */
export const locationTagPresets: Record<LocationTagPresetId, LocationTagPreset> = {
  "tag-1": {
    marker: "pin",
    placeLift: 0.19,
    labelFont,
    labelFill: "rgb(16, 26, 50)",
    labelInk: "rgb(234, 241, 255)",
    accent: "rgb(91, 155, 255)",
    accentInk: "rgb(6, 18, 43)",
  },
  "tag-2": {
    marker: "beacon",
    placeLift: 0.1,
    labelFont,
    labelFill: "#0B1F1A",
    labelInk: "#E6FFF6",
    accent: "#35D6A0",
    accentInk: "#03211A",
  },
  "tag-3": {
    marker: "beacon",
    placeLift: 0,
    labelFont,
    labelFill: "rgb(100, 124, 222)",
    labelInk: "rgb(255, 232, 217)",
    accent: "rgb(23, 37, 138)",
    accentInk: "rgb(222, 18, 18)",
  },
  "tag-4": {
    marker: "beacon",
    placeLift: 0.1,
    labelFont,
    labelFill: "#FFFFFF",
    labelInk: "#1A2230",
    accent: "#1B6FE0",
    accentInk: "#FFFFFF",
  },
};

/** Route values and colors are copied from each source section, independent of body palette. */
export const orbitPresets: Record<OrbitPresetId, OrbitPreset> = {
  "orbit-1": {
    routeMode: "chain", routeStyle: "beads", routeAltitude: 0.25, routeDots: 76,
    routeRest: 0.45, routeSize: 6, routeSpeed: 0.22, routeTrail: 0.3,
    routeWidth: 2, dashCount: 18, routeColor: "rgb(91, 155, 255)",
  },
  "orbit-2": {
    routeMode: "hub", routeStyle: "dashed", routeAltitude: 0.4, routeDots: 56,
    routeRest: 0.32, routeSize: 6, routeSpeed: 0.65, routeTrail: 0.3,
    routeWidth: 3, dashCount: 18, routeColor: "#35D6A0",
  },
  "orbit-3": {
    routeMode: "mesh", routeStyle: "pulse", routeAltitude: 0.15, routeDots: 56,
    routeRest: 0.4, routeSize: 6, routeSpeed: 0.22, routeTrail: 0.3,
    routeWidth: 1.5, dashCount: 18, routeColor: "rgb(23, 37, 138)",
  },
  "orbit-4": {
    routeMode: "chain", routeStyle: "comet", routeAltitude: 1.15, routeDots: 88,
    routeRest: 0.2, routeSize: 6.5, routeSpeed: 0.2, routeTrail: 1,
    routeWidth: 2, dashCount: 18, routeColor: "#1B6FE0",
  },
};

export const originalGlobeRecipes: Record<`original-${1 | 2 | 3 | 4}`, GlobeAnimationRecipe> = {
  "original-1": { globe: "globe-1", locationTag: "tag-1", orbit: "orbit-1", particleField: "off", surface: "terrestrial", cityUi: "show", globeColor: "source", orbitColor: "source", hoverPhysics: "source", hoverStrength: 1, surfaceShading: 0, dotDensity: 1, dragEnabled: true, dragSensitivity: 1, dragInertia: 0.5, dragTilt: "source", orbitLinesOn: true, orbitMotionMode: "linked" },
  "original-2": { globe: "globe-2", locationTag: "tag-2", orbit: "orbit-2", particleField: "off", surface: "terrestrial", cityUi: "show", globeColor: "source", orbitColor: "source", hoverPhysics: "source", hoverStrength: 1, surfaceShading: 0, dotDensity: 1, dragEnabled: true, dragSensitivity: 1, dragInertia: 0.5, dragTilt: "source", orbitLinesOn: true, orbitMotionMode: "linked" },
  "original-3": { globe: "globe-3", locationTag: "tag-3", orbit: "orbit-3", particleField: "off", surface: "terrestrial", cityUi: "show", globeColor: "source", orbitColor: "source", hoverPhysics: "source", hoverStrength: 1, surfaceShading: 0, dotDensity: 1, dragEnabled: true, dragSensitivity: 1, dragInertia: 0.5, dragTilt: "source", orbitLinesOn: true, orbitMotionMode: "linked" },
  "original-4": { globe: "globe-4", locationTag: "tag-4", orbit: "orbit-4", particleField: "lychee", surface: "terrestrial", cityUi: "show", globeColor: "source", orbitColor: "source", hoverPhysics: "source", hoverStrength: 1, surfaceShading: 0, dotDensity: 1, dragEnabled: true, dragSensitivity: 1, dragInertia: 0.5, dragTilt: "source", orbitLinesOn: true, orbitMotionMode: "linked" },
};

/** Narrow adapter from canonical PBDS values for globe composition previews. */
export const PBDS_GLOBE_COLOR_ADAPTER: Record<Exclude<GlobeColorId, "source">, string> = {
  magenta: "#FF2FAE",
  "template-magenta": "#F10F8A",
  white: "#FFFFFF",
  mid: "#7A7A7A",
  line: "#E6E6E6",
};

export const resolveGlobeColor = (color: GlobeColorId): string | null =>
  color === "source" ? null : PBDS_GLOBE_COLOR_ADAPTER[color];

/** Narrow adapter from accepted PBDS surface lighting colors to the globe field shader. */
export const PBDS_GLOBE_SURFACE_PROFILES: Record<Exclude<GlobeColorId, "source">, GlobeSurfaceColorProfile> = {
  magenta: {
    shadow: "#3A0B28", dark: "#7E165A", mid: "#FF2FAE", light: "#FF78CB", hot: "#FF8FD5", hotThreshold: 0.9,
  },
  "template-magenta": {
    shadow: "#580024", dark: "#540123", mid: "#F10F8A", light: "#E92FB0", hot: "#FB88E6", hotThreshold: 0.9,
  },
  white: {
    shadow: "#1F2933", dark: "#56616F", mid: "#AEB8C4", light: "#DCE3EA", hot: "#F6F8FA", hotThreshold: 0.9,
  },
  mid: {
    shadow: "#252525", dark: "#4A4A4A", mid: "#7A7A7A", light: "#B0B0B0", hot: "#E6E6E6", hotThreshold: 0.9,
  },
  line: {
    shadow: "#666666", dark: "#A0A0A0", mid: "#E6E6E6", light: "#F2F2F2", hot: "#FFFFFF", hotThreshold: 0.9,
  },
};

export const PBDS_GLOBE_ORBIT_PROFILES: Record<Exclude<GlobeColorId, "source">, { base: string; active: string }> = {
  magenta: { base: "#FF65C7", active: "#FF2FAE" },
  "template-magenta": { base: "#FF65C7", active: "#FF2FAE" },
  white: { base: "#FFFFFF", active: "#FFFFFF" },
  mid: { base: "#7A7A7A", active: "#7A7A7A" },
  line: { base: "#E6E6E6", active: "#E6E6E6" },
};

export const resolveGlobeOrbitColors = (color: GlobeColorId) =>
  color === "source" ? null : PBDS_GLOBE_ORBIT_PROFILES[color];

export const resolveGlobeSurfaceProfile = (color: GlobeColorId): GlobeSurfaceColorProfile | null =>
  color === "source" ? null : PBDS_GLOBE_SURFACE_PROFILES[color];
