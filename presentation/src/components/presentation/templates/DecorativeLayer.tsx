import { PresentationDecorativePlane } from "@/components/presentation/PresentationCanvas";
import type { CSSProperties } from "react";
import { PBDSOrb, type PBDSOrbProps } from "@/components/pbds/orb/PBDSOrb";
import { orbPresets, type PBDSOrbPresetName } from "@/components/pbds/orb/orbPresets";
import type { DecorativeVariant } from "@/components/presentation/presentationTypes";

const A = "./pdma2026-templates/assets";

type DecorImage = {
  src: string;
  /** Logical-canvas placement measured from the approved reference / live exemplar render. */
  x: number;
  y: number;
  w: number;
  h: number;
  opacity?: number;
  /** Ambient motion class suffix (pdmat-deco-item--<ambient>), defined next to the owning styles. */
  ambient?: string;
};

/** Non-content overlay that dissolves an asset's cropped edge into the canvas background. */
type DecorFade = { fade: "bottom"; y: number; h: number };

/**
 * Live PBDS kinetic orb. Always mounted on the full 1920×1080 decorative plane: the renderer's
 * crop geometry is edge-anchored to its parent, so it must never be boxed into a still's rectangle.
 */
type DecorOrb = { orb: PBDSOrbPresetName; radius?: number; viewport?: { x: number; y: number; w: number; h: number }; fullPlane?: boolean; visualScale?: number; offsetX?: number; offsetY?: number; interactive?: boolean; props?: Omit<PBDSOrbProps, "preset" | "radius" | "interactive"> };

export type DecorItem = DecorImage | DecorFade | DecorOrb;

export const isDecorImage = (item: DecorItem): item is DecorImage => "src" in item;
export const isDecorOrb = (item: DecorItem): item is DecorOrb => "orb" in item;

/**
 * Decorative layer registry. Items are bounded to the slide's decorative layer and never
 * participate in content layout; swapping a variant never changes template structure.
 */
export const decorativeVariants: Record<DecorativeVariant, readonly DecorItem[]> = {
  "title-hero": [
    { src: "./pdma2026-2/slide-01/slide-01-planet-back.png", x: 780, y: 115, w: 930, h: 698, ambient: "drift-back" },
    { src: "./pdma2026-2/slide-01/slide-01-planet-foreground.png", x: 1060, y: 250, w: 780, h: 780, ambient: "drift-front" },
    { src: "./pdma2026-2/slide-01/slide-01-asterisk-hero.png", x: 960, y: 150, w: 760, h: 760, ambient: "drift-hero" },
  ],
  "end-card-orb": [
    { src: `${A}/end-card/end-card-electric-orb-right-v1.png`, x: 315, y: 66, w: 1605, h: 903 },
    { fade: "bottom", y: 860, h: 105 },
  ],
  "compare-edge-planets": [
    { src: "./pdma2026-2/slide-03/02283.png", x: -165, y: 251, w: 760, h: 760, opacity: 0.9 },
    { src: "./pdma2026-2/slide-03/44753.png", x: 1260, y: 242, w: 830, h: 830 },
  ],
  "flow-dual-orbs": [
    { src: `${A}/flow-scenario/slide-09-left-orb-white-v1.png`, x: -316, y: 335, w: 537, h: 537 },
    { src: `${A}/flow-scenario/slide-09-right-orb-magenta-v1.png`, x: 1685, y: 30, w: 980, h: 980 },
  ],
  "spectrum-horizon": [
    { src: "./pdma2026-2/slide-08/slide-08-planet-horizon.png", x: 0, y: 300, w: 1920, h: 640 },
    { src: "./pdma2026-2/slide-08/slide-08-authority-arc.png", x: 0, y: 260, w: 1920, h: 640 },
  ],
  "hub-corner-orbs": [
    { src: `${A}/hub-ecosystem/slide-06-left-orb-white-v1.png`, x: 0, y: 610, w: 470, h: 470 },
    { src: `${A}/hub-ecosystem/slide-06-right-orb-magenta-v1.png`, x: 1480, y: 60, w: 440, h: 440 },
  ],
  "structured-dual-orbs": [
    { src: `${A}/structured-content-action/slide-10-left-orb-magenta-v1.png`, x: -106, y: 221, w: 750, h: 750 },
    { src: `${A}/structured-content-action/slide-10-right-orb-magenta-orbit-v1.png`, x: 1297, y: -55, w: 850, h: 850 },
  ],
  "embedded-dual-orbs": [
    { src: `${A}/embedded-app/embedded-app-left-orb-magenta-v1.png`, x: -112, y: 275, w: 1000, h: 1000 },
    { src: `${A}/embedded-app/embedded-app-right-orb-white-v1.png`, x: 917, y: -48, w: 1253, h: 1253 },
  ],
  none: [],
};

/** Which half of the plane an orb owns for pointer hit-testing (its crop anchor). */
const orbSide = (preset: PBDSOrbPresetName) => orbPresets[preset].cropPosition === "orb-left" ? "left" : "right";

export function DecorativeLayer({ variant, items: explicitItems }: { variant: DecorativeVariant; items?: readonly DecorItem[] }) {
  const items = explicitItems ?? decorativeVariants[variant];
  return <PresentationDecorativePlane><div className="pdmat-deco" aria-hidden="true" data-decorative-variant={explicitItems ? "custom" : variant}>
    {items.map((item) => isDecorOrb(item) ? <div key={`orb-${item.orb}`} className={`pdmat-deco-orb${item.fullPlane ? "" : ` pdmat-deco-orb--${orbSide(item.orb)}`}`} style={item.viewport ? { inset: "auto", left: `calc(${item.viewport.x}px + ${orbSide(item.orb) === "right" ? "var(--pdma-art-extra)" : "0px"})`, top: item.viewport.y, width: item.viewport.w, height: item.viewport.h } : item.visualScale || item.offsetX || item.offsetY ? { transform: `${item.offsetX || item.offsetY ? `translate(${item.offsetX ?? 0}px, ${item.offsetY ?? 0}px)` : ""}${item.visualScale ? ` scale(${item.visualScale})` : ""}`, transformOrigin: "0 0" } : undefined}>
      <PBDSOrb {...item.props} preset={item.orb} radius={item.radius} interactive={item.interactive} />
    </div> : isDecorImage(item) ? <img
      key={item.src}
      className={`pdmat-deco-item pdmat-deco-item--${variant === "title-hero" || variant === "end-card-orb" ? "right" : item.w >= 1500 ? "field" : item.x + item.w / 2 < 640 ? "left" : item.x + item.w / 2 > 1280 ? "right" : "center"}${item.ambient ? ` pdmat-deco-item--${item.ambient}` : ""}`}
      src={item.src}
      alt=""
      draggable={false}
      style={{ "--x": `${item.x}px`, "--y": `${item.y}px`, "--w": `${item.w}px`, "--h": `${item.h}px`, "--o": item.opacity ?? 1 } as CSSProperties}
    /> : <span key={`fade-${item.fade}`} className={`pdmat-deco-fade pdmat-deco-fade--${item.fade}`} style={{ "--y": `${item.y}px`, "--h": `${item.h}px` } as CSSProperties} />)}
  </div></PresentationDecorativePlane>;
}
