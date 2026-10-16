"use client";

import { useEffect, useMemo, useRef } from "react";
import { GlobeCore } from "./GlobeCore";
import { DEFAULT_PLACES, type GlobeConfig, type GlobeAnimationRecipe } from "./globeTypes";
import { globeBodyPresets, locationTagPresets, orbitPresets, resolveGlobeColor, resolveGlobeOrbitColors, resolveGlobeSurfaceProfile } from "./globePresets";

export function MotionGlobe({ recipe }: { recipe: GlobeAnimationRecipe }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<GlobeCore | null>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const body = globeBodyPresets[recipe.globe];
  const tag = locationTagPresets[recipe.locationTag];
  const orbit = orbitPresets[recipe.orbit];
  const globeOverride = resolveGlobeColor(recipe.globeColor);
  const surfaceColorProfile = resolveGlobeSurfaceProfile(recipe.globeColor);
  const orbitColors = resolveGlobeOrbitColors(recipe.orbitColor);
  const effectivePalette = globeOverride
    ? { ...body.palette, backdrop: "#090909", ink: globeOverride, tint: globeOverride }
    : body.palette;
  const effectiveTag = globeOverride
    ? { ...tag, labelFill: "#2E2E2E", labelInk: "#FFFFFF", accent: globeOverride, accentInk: "#090909" }
    : tag;
  const config = useMemo<GlobeConfig>(() => ({
    ...body,
    ...orbit,
    pbdsAtmosphereOn: recipe.particleField === "pbds-lab",
    palette: effectivePalette,
    surfaceColorProfile: surfaceColorProfile ?? undefined,
    surfaceShading: recipe.globeColor === "source" ? 0 : recipe.surfaceShading,
    routeColor: orbitColors?.base ?? orbit.routeColor,
    routeActiveColor: orbitColors?.active ?? orbit.routeColor,
    routeColorIsSrgb: orbitColors !== null,
    coastLift: recipe.surface === "dot-orb" ? 0 : body.coastLift,
    places: DEFAULT_PLACES,
    surfaceMode: recipe.surface,
    cursorMode: recipe.hoverPhysics === "source" ? body.cursorMode : recipe.hoverPhysics,
    interactionStrength: recipe.hoverStrength,
    density: body.density,
    dotDensity: recipe.dotDensity,
    dragEnabled: recipe.dragEnabled,
    dragSensitivity: recipe.dragSensitivity,
    dragInertia: recipe.dragInertia,
    orbitMotionMode: recipe.orbitMotionMode,
    allowTiltDrag: recipe.dragTilt === "source" ? body.allowTiltDrag : recipe.dragTilt === "on",
    quality: "auto",
    routesOn: recipe.orbitLinesOn,
    replayOnScroll: true,
    formation: recipe.particleField === "lychee" ? "drift" : body.formation,
  }), [body, orbit, effectivePalette, surfaceColorProfile, orbitColors, recipe.globeColor, recipe.surfaceShading, recipe.particleField, recipe.surface, recipe.hoverPhysics, recipe.hoverStrength, recipe.dotDensity, recipe.dragEnabled, recipe.dragSensitivity, recipe.dragInertia, recipe.dragTilt, recipe.orbitLinesOn, recipe.orbitMotionMode]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const core = new GlobeCore(host, config);
    coreRef.current = core;
    return () => {
      coreRef.current = null;
      core.dispose();
    };
    // One renderer instance owns all preset updates and is disposed with this slide.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const core = coreRef.current;
    if (!core) return;
    core.apply(config);
  }, [config]);

  useEffect(() => {
    coreRef.current?.setPlaces(DEFAULT_PLACES, effectiveTag.marker === "pin" ? effectiveTag.placeLift : 0);
    coreRef.current?.setPlaceNodes(recipe.cityUi === "show" ? labelRefs.current : []);
  }, [recipe.locationTag, recipe.cityUi, effectiveTag]);

  useEffect(() => {
    coreRef.current?.replayEntrance();
  }, [config.formation, config.entranceSeconds]);

  return <div className="motion-globe" style={{ background: effectivePalette.backdrop }}>
    <div ref={hostRef} className="motion-globe__webgl" aria-hidden="true" />
    <div className="motion-globe__labels" aria-label="Global locations">
      {recipe.cityUi === "show" && DEFAULT_PLACES.map((place, index) => (
        <div
          key={place.label}
          ref={(node) => { labelRefs.current[index] = node; }}
          className={`motion-globe__tag motion-globe__tag--${effectiveTag.marker}`}
          style={{
            color: effectiveTag.labelInk,
            background: effectiveTag.labelFill,
            boxShadow: `0 2px 10px rgba(0,0,0,.22), 0 0 0 1px ${effectiveTag.accent}55`,
            fontFamily: effectiveTag.labelFont.fontFamily,
            fontSize: effectiveTag.labelFont.fontSize,
            fontWeight: effectiveTag.labelFont.fontWeight,
            letterSpacing: effectiveTag.labelFont.letterSpacing,
          }}
        >
          <span className="motion-globe__marker" style={{ background: effectiveTag.accent, color: effectiveTag.accentInk }} aria-hidden="true">
            {effectiveTag.marker === "pin" ? <i /> : <b />}
          </span>
          <span>{place.label}</span>
        </div>
      ))}
    </div>
  </div>;
}
