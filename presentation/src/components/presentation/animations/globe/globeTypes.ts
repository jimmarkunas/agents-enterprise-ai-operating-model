import type { CSSProperties } from "react";

export type GlobePresetId = "globe-1" | "globe-2" | "globe-3" | "globe-4";
export type LocationTagPresetId = "tag-1" | "tag-2" | "tag-3" | "tag-4";
export type OrbitPresetId = "orbit-1" | "orbit-2" | "orbit-3" | "orbit-4";
export type ParticleFieldEffect = "off" | "pbds-lab" | "lychee";
export type GlobeSurfaceMode = "terrestrial" | "dot-orb";
export type CityUiMode = "show" | "hide";
export type GlobeColorId = "source" | "magenta" | "template-magenta" | "white" | "mid" | "line";
export type GlobeHoverPhysics = "source" | "off" | "repel" | "attract" | "swirl" | "burst" | "sonar" | "halo" | "wake";
export type GlobeOrbitMotionMode = "linked" | "pdma-orbit";

export type GlobeAnimationRecipe = {
  globe: GlobePresetId;
  locationTag: LocationTagPresetId;
  orbit: OrbitPresetId;
  particleField: ParticleFieldEffect;
  surface: GlobeSurfaceMode;
  cityUi: CityUiMode;
  globeColor: GlobeColorId;
  orbitColor: GlobeColorId;
  hoverPhysics: GlobeHoverPhysics;
  hoverStrength: number;
  surfaceShading: number;
  dotDensity: number;
  dragEnabled: boolean;
  dragSensitivity: number;
  dragInertia: number;
  dragTilt: "source" | "on" | "off";
  orbitLinesOn: boolean;
  orbitMotionMode: GlobeOrbitMotionMode;
};

export interface PlaceItem {
  label: string;
  lat: number;
  lng: number;
}

export interface GlobePalette {
  backdrop: string;
  ink: string;
  backFade: number;
  tint: string;
}

export interface GlobeSurfaceColorProfile {
  shadow: string;
  dark: string;
  mid: string;
  light: string;
  hot: string;
  hotThreshold: number;
}

export type EntranceFormation = "sweep" | "bloom" | "fall" | "drift" | "instant";
export type RouteMode = "chain" | "hub" | "mesh";
export type RouteStyle = "comet" | "beads" | "dashed" | "pulse";
export type PlaceMarker = "beacon" | "pin";

export interface GlobeConfig {
  surfaceMode: GlobeSurfaceMode;
  pbdsAtmosphereOn: boolean;
  palette: GlobePalette;
  surfaceColorProfile?: GlobeSurfaceColorProfile;
  surfaceShading: number;
  dotDensity: number;
  dragEnabled: boolean;
  dragSensitivity: number;
  dragInertia: number;
  orbitMotionMode: GlobeOrbitMotionMode;
  places: PlaceItem[];
  density: "balanced" | "dense" | "ultra";
  dotSize: number;
  sizeJitter: number;
  coastLift: number;
  spin: number;
  tilt: number;
  startLng: number;
  zoom: number;
  offsetX: number;
  offsetY: number;
  allowTiltDrag: boolean;
  tiltRange: number;
  formation: EntranceFormation;
  entranceSeconds: number;
  replayOnScroll: boolean;
  cursorMode: "sonar" | "halo" | "wake" | "repel" | "attract" | "swirl" | "burst" | "off";
  interactionStrength: number;
  reach: number;
  waveLength: number;
  waveSpeed: number;
  crest: number;
  swell: number;
  glow: number;
  cursorDelay: number;
  routesOn: boolean;
  routeMode: RouteMode;
  routeStyle: RouteStyle;
  routeWidth: number;
  dashCount: number;
  routeSpeed: number;
  routeAltitude: number;
  routeTrail: number;
  routeDots: number;
  routeSize: number;
  routeRest: number;
  routeColor: string;
  routeActiveColor: string;
  routeColorIsSrgb?: boolean;
  quality: "auto";
}

export type GlobeBodyPreset = Pick<GlobeConfig,
  "palette" | "density" | "dotSize" | "sizeJitter" | "coastLift" | "spin" | "tilt" | "startLng" | "zoom" | "offsetX" | "offsetY" | "allowTiltDrag" | "tiltRange" | "formation" | "entranceSeconds" | "cursorMode" | "reach" | "waveLength" | "waveSpeed" | "crest" | "swell" | "glow" | "cursorDelay"
>;

export type LocationTagPreset = {
  marker: PlaceMarker;
  placeLift: number;
  labelFont: CSSProperties;
  labelFill: string;
  labelInk: string;
  accent: string;
  accentInk: string;
};

export type OrbitPreset = Pick<GlobeConfig,
  "routeMode" | "routeStyle" | "routeAltitude" | "routeDots" | "routeRest" | "routeSize" | "routeSpeed" | "routeTrail" | "routeWidth" | "dashCount" | "routeColor"
>;

export const DEFAULT_PLACES: PlaceItem[] = [
  { label: "TORONTO", lat: 43.6532, lng: -79.3832 },
  { label: "BOGOTÁ", lat: 4.711, lng: -74.0721 },
  { label: "BERLIN", lat: 52.52, lng: 13.405 },
  { label: "NAIROBI", lat: -1.2864, lng: 36.8172 },
  { label: "DUBAI", lat: 25.2048, lng: 55.2708 },
  { label: "SEOUL", lat: 37.5665, lng: 126.978 },
  { label: "AUCKLAND", lat: -36.8485, lng: 174.7633 },
];

export const DENSITY_MAP: Record<GlobeConfig["density"], number> = {
  balanced: 72000,
  dense: 130000,
  ultra: 230000,
};
