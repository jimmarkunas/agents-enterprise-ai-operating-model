/**
 * Three.js WebGL Core Engine for Motion Globe
 * Reconstructed 100% identically from delicate-lychee Framer physics & rendering pipeline
 */

import * as THREE from 'three';
import {
  clamp,
  DEG2RAD,
  generateFieldPoints,
  generateSpherePoints,
} from './landmask';
import {
  FIELD_FRAGMENT_SHADER,
  FIELD_VERTEX_SHADER,
  ROUTE_DOTS_FRAGMENT_SHADER,
  ROUTE_DOTS_VERTEX_SHADER,
  ROUTE_LINE_FRAGMENT_SHADER,
  ROUTE_LINE_VERTEX_SHADER,
  PBDS_ATMOSPHERE_FRAGMENT_SHADER,
  PBDS_ATMOSPHERE_VERTEX_SHADER,
} from './shaders';
import {
  DENSITY_MAP,
  type GlobeConfig,
  type PlaceItem,
} from './globeTypes';

export const parseColor = (colorStr: string): { rgb: THREE.Color; alpha: number } => {
  const result = { rgb: new THREE.Color(0xffffff), alpha: 1 };
  if (!colorStr || typeof colorStr !== 'string') return result;
  let str = colorStr.trim();
  if (str.toLowerCase().startsWith('var(')) {
    const comma = str.indexOf(',');
    const close = str.lastIndexOf(')');
    if (comma > -1 && close > comma) {
      str = str.slice(comma + 1, close).trim();
    }
  }
  const hexMatch = /^#([0-9a-f]{3,8})$/i.exec(str);
  if (hexMatch) {
    const raw = hexMatch[1];
    if (raw.length === 4 || raw.length === 8) {
      const step = raw.length / 4;
      const alphaHex = raw.slice(3 * step);
      const fullAlpha = step === 1 ? alphaHex + alphaHex : alphaHex;
      result.alpha = parseInt(fullAlpha, 16) / 255;
    }
    const colorHex = raw.slice(0, raw.length >= 6 ? 6 : 3);
    try {
      result.rgb.set('#' + colorHex);
    } catch {}
    return result;
  }
  const rgbMatch = /^(rgba?|hsla?)\(([^)]*)\)$/i.exec(str);
  if (rgbMatch) {
    const parts = rgbMatch[2].split(/[,/\s]+/).filter(Boolean);
    if (parts.length >= 4) {
      const alphaStr = parts[3];
      const parsed = parseFloat(alphaStr);
      if (!Number.isNaN(parsed)) {
        result.alpha = clamp(alphaStr.endsWith('%') ? parsed / 100 : parsed, 0, 1);
      }
      if (rgbMatch[1].toLowerCase() === 'rgba' || rgbMatch[1].toLowerCase() === 'hsla') {
        str = `${rgbMatch[1].slice(0, 3)}(${parts.slice(0, 3).join(', ')})`;
      }
    }
  }
  try {
    result.rgb.set(str);
  } catch {
    const fallbackHex = /#[0-9a-f]{6}/i.exec(str);
    if (fallbackHex) {
      try {
        result.rgb.set(fallbackHex[0]);
      } catch {}
    }
  }
  return result;
};

export const latLngToVector = (lat: number, lng: number, target?: THREE.Vector3): THREE.Vector3 => {
  const phi = lat * DEG2RAD;
  const theta = lng * DEG2RAD;
  const cosPhi = Math.cos(phi);
  return (target || new THREE.Vector3()).set(Math.sin(theta) * cosPhi, Math.sin(phi), Math.cos(theta) * cosPhi);
};

export const getQualityTier = (quality?: 'auto' | 'high' | 'low'): number => {
  if (quality === 'high') return 2;
  if (quality === 'low') return 0;
  if (typeof navigator === 'undefined') return 2;
  const nav = navigator as any;
  const concurrency = nav.hardwareConcurrency || 8;
  const memory = nav.deviceMemory || 8;
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');
  return isMobile || concurrency <= 4 || memory <= 4 ? 0 : 2;
};

const FOV = 45;
const CAMERA_DISTANCE = 3.5;
const SWEEP_AXIS = new THREE.Vector3(-0.78, 0.46, 0.42).normalize();
const CURSOR_MODES: Record<string, number> = { sonar: 0, halo: 1, wake: 2, repel: 3, attract: 4, swirl: 5, burst: 6, off: 7 };
const ROUTE_STYLES_DOTS: Record<string, number> = { comet: 0, beads: 1 };
const ROUTE_STYLES_LINES: Record<string, number> = { solid: 0, dashed: 1, pulse: 2 };
const FORMATIONS: Record<string, number> = { sweep: 0, bloom: 1, fall: 2, drift: 3, instant: 4 };
const PDMA_INITIAL_ROT_X = 0.08;
const PDMA_INITIAL_ROT_Y = -0.85;
const PDMA_AUTO_ROTATE_SPEED = 0.0012;
export interface InternalPlaceNode {
  vec: THREE.Vector3;
  node: HTMLElement | null;
}

export class GlobeCore {
  host: HTMLElement;
  cfg: GlobeConfig;
  still: boolean;
  tier: number;
  width = 1;
  height = 1;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  pivot: THREE.Group;
  routeGroup: THREE.Group;
  field: THREE.Points | null = null;
  atmosphere: THREE.Mesh<THREE.SphereGeometry, THREE.ShaderMaterial>;
  atmosphereUniforms: Record<string, THREE.IUniform>;
  fieldMaterial: THREE.ShaderMaterial;
  routeMaterial: THREE.ShaderMaterial;
  routeLineMaterial: THREE.ShaderMaterial;
  fieldUniforms: Record<string, THREE.IUniform>;
  routeUniforms: Record<string, THREE.IUniform>;
  routeLineUniforms: Record<string, THREE.IUniform>;

  places: InternalPlaceNode[] = [];
  progress = 0;
  elapsed = 0;
  spinAngle = 0;
  surfaceOrbitAngle = PDMA_INITIAL_ROT_Y;
  tiltAngle = 0;
  scale = 1;
  flingX = 0;
  dragging = false;
  dragFrom = { x: 0, y: 0 };
  pointerInside = false;
  pointerUV = { x: -1, y: -1 };
  hoverSince = 0;
  cursorGain = 0;
  contactLocal = new THREE.Vector3(0, 0, 1);
  lastWorldHit: THREE.Vector3 | null = null;
  drift = new THREE.Vector3();
  visible = true;
  raf: number | null = null;
  last: number | null = null;

  ray = new THREE.Raycaster();
  ndc = new THREE.Vector2();
  localRay = new THREE.Ray();
  unitSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 1);
  inverse = new THREE.Matrix4();
  hit = new THREE.Vector3();
  scratchA = new THREE.Vector3();
  scratchB = new THREE.Vector3();
  scratchC = new THREE.Vector3();
  pivotOrigin = new THREE.Vector3();
  scratchQ = new THREE.Quaternion();
  resizeWatcher: ResizeObserver | null = null;
  viewWatcher: IntersectionObserver | null = null;

  constructor(host: HTMLElement, cfg: GlobeConfig, still = false) {
    this.host = host;
    this.cfg = cfg;
    this.still = still;
    this.tier = getQualityTier(cfg.quality);

    this.measure();

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: this.tier > 0,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.tier > 0 ? 2 : 1.5));
    this.renderer.setSize(this.width, this.height);
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.touchAction = 'none';
    host.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(FOV, this.width / this.height, 0.1, 80);
    this.camera.position.z = CAMERA_DISTANCE;

    this.pivot = new THREE.Group();
    this.pivot.rotation.order = 'XYZ';
    this.scene.add(this.pivot);

    this.atmosphereUniforms = { uProgress: { value: 0 } };
    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: this.atmosphereUniforms,
      vertexShader: PBDS_ATMOSPHERE_VERTEX_SHADER,
      fragmentShader: PBDS_ATMOSPHERE_FRAGMENT_SHADER,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
    });
    this.atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.03, 48, 32), atmosphereMaterial);
    this.atmosphere.frustumCulled = false;
    this.atmosphere.renderOrder = 0;
    this.atmosphere.visible = !!cfg.pbdsAtmosphereOn;
    this.pivot.add(this.atmosphere);

    this.routeGroup = new THREE.Group();
    this.routeGroup.renderOrder = 2;
    this.pivot.add(this.routeGroup);

    this.fieldUniforms = {
      uTime: { value: 0 },
      uSurfaceOrbitX: { value: cfg.orbitMotionMode === 'pdma-orbit' ? PDMA_INITIAL_ROT_X : 0 },
      uSurfaceOrbitY: { value: cfg.orbitMotionMode === 'pdma-orbit' ? PDMA_INITIAL_ROT_Y : 0 },
      uProgress: { value: 0 },
      uFormation: { value: 0 },
      uSweepAxis: { value: SWEEP_AXIS.clone() },
      uDotSize: { value: 5 },
      uSizeJitter: { value: 0.6 },
      uCoastLift: { value: 0.35 },
      uBackFade: { value: 0.14 },
      uCursorMode: { value: 0 },
      uCursor: { value: new THREE.Vector3(0, 0, 1) },
      uCursorGain: { value: 0 },
      uInteractionStrength: { value: 1 },
      uReach: { value: 0.5 },
      uWaveLength: { value: 0.22 },
      uWaveSpeed: { value: 0.55 },
      uCrest: { value: 0.035 },
      uSwell: { value: 1.2 },
      uGlow: { value: 1 },
      uDrift: { value: new THREE.Vector3() },
      uInk: { value: new THREE.Color(0xc9dcff) },
      uInkAlpha: { value: 1 },
      uTint: { value: new THREE.Color(0x7fb2ff) },
      uSurfaceLit: { value: 0 },
      uSurfaceShading: { value: 0 },
      uSurfaceBaseColor: { value: new THREE.Vector3(1, 1, 1) },
      uSurfaceShadow: { value: new THREE.Color(0x000000) },
      uSurfaceDark: { value: new THREE.Color(0x000000) },
      uSurfaceMid: { value: new THREE.Color(0xffffff) },
      uSurfaceLight: { value: new THREE.Color(0xffffff) },
      uSurfaceHot: { value: new THREE.Color(0xffffff) },
      uSurfaceHotThreshold: { value: 0.9 },
    };

    this.fieldMaterial = new THREE.ShaderMaterial({
      uniforms: this.fieldUniforms,
      vertexShader: FIELD_VERTEX_SHADER,
      fragmentShader: FIELD_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    this.routeUniforms = {
      uTime: { value: 0 },
      uSpeed: { value: 0.22 },
      uTrail: { value: 0.3 },
      uSize: { value: 4 },
      uRest: { value: 0.22 },
      uStyle: { value: 0 },
      uProgress: { value: 0 },
      uColor: { value: new THREE.Color(0x5b9bff) },
      uActiveColor: { value: new THREE.Color(0x5b9bff) },
    };

    this.routeMaterial = new THREE.ShaderMaterial({
      uniforms: this.routeUniforms,
      vertexShader: ROUTE_DOTS_VERTEX_SHADER,
      fragmentShader: ROUTE_DOTS_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    this.routeLineUniforms = {
      uTime: { value: 0 },
      uSpeed: { value: 0.22 },
      uTrail: { value: 0.3 },
      uRest: { value: 0.32 },
      uProgress: { value: 0 },
      uStyle: { value: 0 },
      uWidth: { value: 2 },
      uDashCount: { value: 18 },
      uResolution: { value: new THREE.Vector2(this.width, this.height) },
      uColor: { value: new THREE.Color(0x5b9bff) },
      uActiveColor: { value: new THREE.Color(0x5b9bff) },
    };

    this.routeLineMaterial = new THREE.ShaderMaterial({
      uniforms: this.routeLineUniforms,
      vertexShader: ROUTE_LINE_VERTEX_SHADER,
      fragmentShader: ROUTE_LINE_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending,
    });

    this.spinAngle = -(cfg.startLng || 0) * DEG2RAD;
    this.tiltAngle = (cfg.tilt || 0) * DEG2RAD;
    this.pivot.rotation.set(this.tiltAngle, this.spinAngle, 0);

    this.bindPointer();

    this.resizeWatcher = new ResizeObserver(() => this.resize());
    this.resizeWatcher.observe(host);

    this.viewWatcher = new IntersectionObserver((entries) => {
      const isVis = entries[0]?.isIntersecting ?? false;
      if (!this.still && this.cfg.replayOnScroll && isVis !== this.visible) {
        this.progress = 0;
        this.elapsed = 0;
      }
      this.visible = isVis;
    });
    this.viewWatcher.observe(host);

    this.apply(cfg);
    this.buildField();
    this.buildRoutes();

    if (this.still) {
      this.paintStatic();
    } else {
      this.raf = requestAnimationFrame(this.tick);
    }
  }

  apply(cfg: GlobeConfig) {
    const previous = this.cfg;
    this.cfg = cfg;
    this.atmosphere.visible = !!cfg.pbdsAtmosphereOn;
    const fUni = this.fieldUniforms;
    const rUni = this.routeUniforms;

    const inkColor = cfg.palette.ink;
    const tintColor = cfg.palette.tint;
    const accentColor = cfg.routeColor;
    const backFade = cfg.palette.backFade;

    const inkParsed = parseColor(inkColor);
    fUni.uInk.value.copy(inkParsed.rgb);
    fUni.uInkAlpha.value = inkParsed.alpha;
    fUni.uTint.value.copy(parseColor(tintColor).rgb);
    const surfaceProfile = cfg.surfaceColorProfile;
    fUni.uSurfaceLit.value = surfaceProfile ? 1 : 0;
    fUni.uSurfaceShading.value = clamp(cfg.surfaceShading, 0, 1);
    if (surfaceProfile) {
      const setSurfaceColor = (uniform: THREE.IUniform, color: string) => {
        const parsed = parseColor(color).rgb;
        const srgb = parsed.getHex();
        uniform.value.set(((srgb >> 16) & 0xff) / 255, ((srgb >> 8) & 0xff) / 255, (srgb & 0xff) / 255);
      };
      const baseSrgb = parseColor(cfg.palette.ink).rgb.getHex();
      fUni.uSurfaceBaseColor.value.set(((baseSrgb >> 16) & 0xff) / 255, ((baseSrgb >> 8) & 0xff) / 255, (baseSrgb & 0xff) / 255);
      setSurfaceColor(fUni.uSurfaceShadow, surfaceProfile.shadow);
      setSurfaceColor(fUni.uSurfaceDark, surfaceProfile.dark);
      setSurfaceColor(fUni.uSurfaceMid, surfaceProfile.mid);
      setSurfaceColor(fUni.uSurfaceLight, surfaceProfile.light);
      setSurfaceColor(fUni.uSurfaceHot, surfaceProfile.hot);
      fUni.uSurfaceHotThreshold.value = clamp(surfaceProfile.hotThreshold, 0, 1);
    }
    fUni.uBackFade.value = clamp(backFade, 0, 1);
    fUni.uDotSize.value = cfg.dotSize ?? 5;
    fUni.uSizeJitter.value = clamp(cfg.sizeJitter ?? 0.6, 0, 1);
    fUni.uCoastLift.value = clamp(cfg.coastLift ?? 0.35, 0, 1);
    fUni.uFormation.value = FORMATIONS[cfg.formation || 'sweep'] ?? 0;
    fUni.uCursorMode.value = CURSOR_MODES[cfg.cursorMode || 'sonar'] ?? 7;
    fUni.uInteractionStrength.value = clamp(cfg.interactionStrength ?? 1, 0.25, 2);
    fUni.uReach.value = Math.max(0.05, cfg.reach ?? 0.5);
    fUni.uWaveLength.value = Math.max(0.02, cfg.waveLength ?? 0.22);
    fUni.uWaveSpeed.value = cfg.waveSpeed ?? 0.55;
    fUni.uCrest.value = cfg.crest ?? 0.035;
    fUni.uSwell.value = cfg.swell ?? 1.2;
    fUni.uGlow.value = cfg.glow ?? 1;

    const setRouteColor = (uniform: THREE.IUniform, color: string) => {
      const parsed = parseColor(color).rgb;
      if (cfg.routeColorIsSrgb) {
        const srgb = parsed.getHex();
        uniform.value.set(((srgb >> 16) & 0xff) / 255, ((srgb >> 8) & 0xff) / 255, (srgb & 0xff) / 255);
      } else {
        uniform.value.copy(parsed);
      }
    };
    setRouteColor(rUni.uColor, accentColor);
    setRouteColor(rUni.uActiveColor, cfg.routeActiveColor);
    rUni.uSpeed.value = cfg.routeSpeed ?? 0.22;
    rUni.uTrail.value = clamp(cfg.routeTrail ?? 0.3, 0.02, 1);
    rUni.uSize.value = cfg.routeSize ?? 6;
    rUni.uRest.value = clamp(cfg.routeRest ?? 0.22, 0, 1);
    rUni.uStyle.value = ROUTE_STYLES_DOTS[cfg.routeStyle || 'comet'] ?? 0;
    const lineUni = this.routeLineUniforms;
    setRouteColor(lineUni.uColor, accentColor);
    setRouteColor(lineUni.uActiveColor, cfg.routeActiveColor);
    lineUni.uSpeed.value = cfg.routeSpeed ?? 0.22;
    lineUni.uTrail.value = clamp(cfg.routeTrail ?? 0.3, 0.02, 1);
    lineUni.uRest.value = clamp(cfg.routeRest ?? 0.32, 0, 1);
    lineUni.uWidth.value = Math.max(0.5, cfg.routeWidth ?? 2);
    lineUni.uDashCount.value = Math.max(2, cfg.dashCount ?? 18);
    lineUni.uStyle.value = ROUTE_STYLES_LINES[cfg.routeStyle || 'solid'] ?? 0;

    this.routeGroup.visible = !!cfg.routesOn;
    if (cfg.orbitMotionMode === "pdma-orbit") {
      if (previous.orbitMotionMode !== "pdma-orbit") {
        this.surfaceOrbitAngle = PDMA_INITIAL_ROT_Y;
      }
      fUni.uSurfaceOrbitX.value = PDMA_INITIAL_ROT_X;
      fUni.uSurfaceOrbitY.value = this.surfaceOrbitAngle;
    } else {
      this.surfaceOrbitAngle = 0;
      fUni.uSurfaceOrbitX.value = 0;
      fUni.uSurfaceOrbitY.value = 0;
    }
    if (previous.surfaceMode !== cfg.surfaceMode || previous.dotDensity !== cfg.dotDensity || (cfg.surfaceMode === "terrestrial" && previous.density !== cfg.density)) this.buildField();
    if (previous.places !== cfg.places || previous.routeMode !== cfg.routeMode || previous.routeStyle !== cfg.routeStyle || previous.routeAltitude !== cfg.routeAltitude || previous.routeDots !== cfg.routeDots || previous.routesOn !== cfg.routesOn) this.buildRoutes();
    if (this.still) this.paintStatic();
  }

  setPlaces(items: PlaceItem[], lift = 0) {
    const r = 1.015 + Math.max(0, lift);
    this.places = items.map((item) => ({
      vec: latLngToVector(item.lat, item.lng).multiplyScalar(r),
      node: null,
    }));
  }

  setPlaceNodes(nodes: (HTMLElement | null)[]) {
    for (let i = 0; i < this.places.length; i++) {
      this.places[i].node = nodes[i] || null;
    }
    if (this.still) this.paintStatic();
  }

  replayEntrance() {
    this.progress = 0;
    this.elapsed = 0;
  }

  buildField() {
    this.disposeField();
    const factor = this.tier > 0 ? 1 : 0.45;
    const targetDots = this.cfg.surfaceMode === "dot-orb" ? 8500 : DENSITY_MAP[this.cfg.density];
    const effectiveDots = Math.max(600, Math.round(targetDots * clamp(this.cfg.dotDensity ?? 1, 0.25, 2) * factor));
    const data = this.cfg.surfaceMode === "dot-orb"
      ? generateSpherePoints(effectiveDots)
      : generateFieldPoints(effectiveDots);
    if (!data.count) return;

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(data.position, 3));
    geom.setAttribute('aSeed', new THREE.BufferAttribute(data.seed, 1));
    geom.setAttribute('aCoast', new THREE.BufferAttribute(data.coast, 1));
    geom.setDrawRange(0, data.count);

    this.field = new THREE.Points(geom, this.fieldMaterial);
    this.field.frustumCulled = false;
    this.field.renderOrder = 1;
    this.pivot.add(this.field);

    if (this.still) this.paintStatic();
  }

  buildRoutes() {
    this.disposeRoutes();
    const cfg = this.cfg;
    const places = cfg.places || [];
    if (!cfg.routesOn || places.length < 2) return;

    const pairs: [number, number][] = [];
    if (cfg.routeMode === 'mesh') {
      for (let i = 0; i < places.length; i++) {
        for (let j = i + 1; j < places.length; j++) {
          pairs.push([i, j]);
        }
      }
    } else if (cfg.routeMode === 'hub') {
      for (let i = 1; i < places.length; i++) {
        pairs.push([0, i]);
      }
    } else {
      // chain
      for (let i = 0; i < places.length; i++) {
        pairs.push([i, (i + 1) % places.length]);
      }
    }

    if (!pairs.length) return;

    const isLine = cfg.routeStyle && ['solid', 'dashed', 'pulse'].includes(cfg.routeStyle);
    const numPoints = isLine ? 96 : Math.max(8, Math.round(cfg.routeDots ?? 56));
    const vecA = new THREE.Vector3();
    const vecB = new THREE.Vector3();

    pairs.forEach(([fromIdx, toIdx], pairIdx) => {
      latLngToVector(places[fromIdx].lat, places[fromIdx].lng, vecA);
      latLngToVector(places[toIdx].lat, places[toIdx].lng, vecB);

      const dot = clamp(vecA.dot(vecB), -1, 1);
      const angle = Math.acos(dot);
      const altitude = 0.05 + (angle / Math.PI) * (cfg.routeAltitude ?? 0.4);
      const pairOffset = pairIdx / pairs.length;
      const positions = new Float32Array(numPoints * 3);

      for (let pt = 0; pt < numPoints; pt++) {
        const t = pt / (numPoints - 1);
        let x: number, y: number, z: number;
        if (angle < 1e-4) {
          x = vecA.x;
          y = vecA.y;
          z = vecA.z;
        } else {
          const sinAngle = Math.sin(angle);
          const weightA = Math.sin((1 - t) * angle) / sinAngle;
          const weightB = Math.sin(t * angle) / sinAngle;
          x = vecA.x * weightA + vecB.x * weightB;
          y = vecA.y * weightA + vecB.y * weightB;
          z = vecA.z * weightA + vecB.z * weightB;
        }
        const len = Math.hypot(x, y, z) || 1;
        const lift = (1 + altitude * Math.sin(Math.PI * t)) / len;
        positions[pt * 3] = x * lift;
        positions[pt * 3 + 1] = y * lift;
        positions[pt * 3 + 2] = z * lift;
      }

      const geom = new THREE.BufferGeometry();

      if (!isLine) {
        // Point dots route (comet or beads)
        const steps = new Float32Array(numPoints);
        const offsets = new Float32Array(numPoints);
        for (let pt = 0; pt < numPoints; pt++) {
          steps[pt] = pt / (numPoints - 1);
          offsets[pt] = pairOffset;
        }
        geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geom.setAttribute('aStep', new THREE.BufferAttribute(steps, 1));
        geom.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 1));

        const pts = new THREE.Points(geom, this.routeMaterial);
        pts.frustumCulled = false;
        this.routeGroup.add(pts);
        return;
      }

      // Line mesh route (solid, dashed, pulse)
      const count = numPoints * 2;
      const ribbonPos = new Float32Array(count * 3);
      const tangents = new Float32Array(count * 3);
      const sides = new Float32Array(count);
      const steps = new Float32Array(count);
      const offsets = new Float32Array(count);

      for (let pt = 0; pt < numPoints; pt++) {
        const prev = Math.max(0, pt - 1) * 3;
        const next = Math.min(numPoints - 1, pt + 1) * 3;
        let tx = positions[next] - positions[prev];
        let ty = positions[next + 1] - positions[prev + 1];
        let tz = positions[next + 2] - positions[prev + 2];
        const tLen = Math.hypot(tx, ty, tz) || 1;
        tx /= tLen;
        ty /= tLen;
        tz /= tLen;

        for (let side = 0; side < 2; side++) {
          const vertIdx = pt * 2 + side;
          ribbonPos[vertIdx * 3] = positions[pt * 3];
          ribbonPos[vertIdx * 3 + 1] = positions[pt * 3 + 1];
          ribbonPos[vertIdx * 3 + 2] = positions[pt * 3 + 2];
          tangents[vertIdx * 3] = tx;
          tangents[vertIdx * 3 + 1] = ty;
          tangents[vertIdx * 3 + 2] = tz;
          sides[vertIdx] = side === 0 ? -1 : 1;
          steps[vertIdx] = pt / (numPoints - 1);
          offsets[vertIdx] = pairOffset;
        }
      }

      const indices = new Uint16Array((numPoints - 1) * 6);
      for (let pt = 0; pt < numPoints - 1; pt++) {
        const base = pt * 2;
        const idx = pt * 6;
        indices[idx] = base;
        indices[idx + 1] = base + 1;
        indices[idx + 2] = base + 2;
        indices[idx + 3] = base + 1;
        indices[idx + 4] = base + 3;
        indices[idx + 5] = base + 2;
      }

      geom.setAttribute('position', new THREE.BufferAttribute(ribbonPos, 3));
      geom.setAttribute('aTangent', new THREE.BufferAttribute(tangents, 3));
      geom.setAttribute('aSide', new THREE.BufferAttribute(sides, 1));
      geom.setAttribute('aStep', new THREE.BufferAttribute(steps, 1));
      geom.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 1));
      geom.setIndex(new THREE.BufferAttribute(indices, 1));

      const mesh = new THREE.Mesh(geom, this.routeLineMaterial);
      mesh.frustumCulled = false;
      this.routeGroup.add(mesh);
    });

    if (this.still) this.paintStatic();
  }

  bindPointer() {
    this.host.addEventListener('pointerdown', this.onDown);
    this.host.addEventListener('pointerleave', this.onLeave);
    window.addEventListener('pointermove', this.onMove);
    window.addEventListener('pointerup', this.onUp);
    window.addEventListener('pointercancel', this.onUp);
  }

  onDown = (e: PointerEvent) => {
    const target = e.target as HTMLElement | null;
    if (!this.cfg.dragEnabled || (target && target.closest('.mg-interactive'))) return;
    this.dragging = true;
    this.flingX = 0;
    this.dragFrom.x = e.clientX;
    this.dragFrom.y = e.clientY;
  };

  onMove = (e: PointerEvent) => {
    const rect = this.host.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    this.pointerUV.x = (e.clientX - rect.left) / rect.width;
    this.pointerUV.y = (e.clientY - rect.top) / rect.height;

    const inside =
      this.pointerUV.x >= 0 &&
      this.pointerUV.x <= 1 &&
      this.pointerUV.y >= 0 &&
      this.pointerUV.y <= 1;

    if (inside && !this.pointerInside) {
      this.hoverSince = performance.now();
    }
    this.pointerInside = inside;

    if (!this.dragging) return;

    const scaleFactor = rect.width / this.width || 1;
    const dx = (e.clientX - this.dragFrom.x) / scaleFactor;
    const dy = (e.clientY - this.dragFrom.y) / scaleFactor;
    this.dragFrom.x = e.clientX;
    this.dragFrom.y = e.clientY;

    const SENSITIVITY = 0.0075 * clamp(this.cfg.dragSensitivity ?? 1, 0.25, 2);
    this.flingX = dx * SENSITIVITY;
    this.spinAngle += this.flingX;

    if (this.cfg.allowTiltDrag) {
      const maxTilt = (this.cfg.tiltRange ?? 70) * DEG2RAD;
      this.tiltAngle = clamp(this.tiltAngle + dy * SENSITIVITY, -maxTilt, maxTilt);
    }
  };

  onUp = () => {
    this.dragging = false;
  };

  onLeave = () => {
    if (!this.dragging) {
      this.pointerInside = false;
      this.lastWorldHit = null;
    }
  };

  measure() {
    this.width = Math.max(1, this.host.clientWidth || 1);
    this.height = Math.max(1, this.host.clientHeight || 1);
  }

  fitScale(): number {
    const visibleH = 2 * Math.tan((FOV * DEG2RAD) / 2) * CAMERA_DISTANCE;
    const visibleW = visibleH * (this.width / this.height);
    return (Math.min(visibleH, visibleW) / 2.6) * (this.cfg.zoom ?? 1);
  }

  resize() {
    this.measure();
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
    this.routeLineUniforms.uResolution.value.set(this.width, this.height);
    if (this.still) {
      this.paintStatic();
    } else if (!this.visible) {
      this.renderOnce();
    }
  }

  renderOnce() {
    this.renderer.render(this.scene, this.camera);
  }

  paintStatic() {
    this.progress = 1;
    this.fieldUniforms.uProgress.value = 1;
    this.atmosphereUniforms.uProgress.value = 1;
    this.routeUniforms.uProgress.value = 1;
    this.routeLineUniforms.uProgress.value = 1;
    this.scale = this.fitScale();
    this.pivot.scale.setScalar(this.scale);
    this.pivot.position.set(this.cfg.offsetX || 0, this.cfg.offsetY || 0, 0);
    this.pivot.rotation.set(this.tiltAngle, this.spinAngle, 0);
    this.scene.updateMatrixWorld(true);
    this.renderer.render(this.scene, this.camera);
    this.placeProjection();
  }

  trackCursor(delta: number) {
    const cfg = this.cfg;
    const active =
      cfg.cursorMode !== 'off' &&
      this.pointerInside &&
      performance.now() - this.hoverSince >= (cfg.cursorDelay || 0) * 1000;

    let targetGain = 0;
    if (active) {
      this.ndc.set(this.pointerUV.x * 2 - 1, -(this.pointerUV.y * 2) + 1);
      this.ray.setFromCamera(this.ndc, this.camera);
      this.inverse.copy(this.pivot.matrixWorld).invert();
      this.localRay.copy(this.ray.ray).applyMatrix4(this.inverse);

      if (this.localRay.intersectSphere(this.unitSphere, this.hit)) {
        targetGain = 1;
        this.contactLocal.copy(this.hit).normalize();
        this.scratchA.copy(this.contactLocal).applyMatrix4(this.pivot.matrixWorld);

        if (this.lastWorldHit) {
          this.scratchB.copy(this.scratchA).sub(this.lastWorldHit);
          this.pivot.getWorldQuaternion(this.scratchQ).invert();
          this.scratchB.applyQuaternion(this.scratchQ).divideScalar(Math.max(0.001, this.scale));
        } else {
          this.scratchB.set(0, 0, 0);
          this.lastWorldHit = new THREE.Vector3();
        }
        this.lastWorldHit.copy(this.scratchA);
        this.drift.lerp(this.scratchB, 0.3);
      } else {
        this.lastWorldHit = null;
      }
    } else {
      this.lastWorldHit = null;
      this.drift.multiplyScalar(Math.pow(0.001, delta));
    }

    this.cursorGain += (targetGain - this.cursorGain) * (1 - Math.pow(0.02, delta));
    this.fieldUniforms.uCursorGain.value = this.cursorGain;
    if (this.cursorGain > 0.004) {
      this.fieldUniforms.uCursor.value.copy(this.contactLocal);
    }
    this.fieldUniforms.uDrift.value.copy(this.drift);
  }

  placeProjection() {
    if (!this.places.length) return;
    const half = { x: this.width / 2, y: this.height / 2 };
    this.pivotOrigin.set(0, 0, 0).applyMatrix4(this.pivot.matrixWorld);

    for (let i = 0; i < this.places.length; i++) {
      const p = this.places[i];
      const node = p.node;
      if (!node) continue;

      this.scratchA.copy(p.vec).applyMatrix4(this.pivot.matrixWorld);
      this.scratchB.copy(this.camera.position).sub(this.scratchA).normalize();
      const facing = this.scratchC.copy(this.scratchA).sub(this.pivotOrigin).normalize().dot(this.scratchB);

      if (facing < -0.08) {
        node.style.opacity = '0';
        node.style.visibility = 'hidden';
        continue;
      }

      this.scratchA.project(this.camera);
      const screenX = (this.scratchA.x + 1) * half.x;
      const screenY = (1 - this.scratchA.y) * half.y;
      const opacity = clamp((facing + 0.08) / 0.3, 0, 1) * this.progress;

      node.style.visibility = 'visible';
      node.style.opacity = String(opacity);
      node.style.transform = `translate3d(${screenX.toFixed(1)}px, ${screenY.toFixed(1)}px, 0)`;
    }
  }

  tick = () => {
    this.raf = requestAnimationFrame(this.tick);
    if (!this.visible) return;

    const now = performance.now();
    const delta = this.last === null ? 1 / 60 : Math.min(0.1, (now - this.last) / 1000);
    this.last = now;
    const n = delta * 60;
    const decay = (rate: number) => 1 - Math.pow(1 - rate, n);
    const timeSec = now / 1000;
    const cfg = this.cfg;

    if (this.progress < 1) {
      this.elapsed += delta;
      this.progress = clamp(this.elapsed / Math.max(0.016, cfg.entranceSeconds || 0.016), 0, 1);
    }

    this.fieldUniforms.uTime.value = timeSec;
    this.fieldUniforms.uProgress.value = this.progress;
    this.atmosphereUniforms.uProgress.value = this.progress;
    this.routeUniforms.uTime.value = timeSec;
    this.routeUniforms.uProgress.value = this.progress;
    this.routeLineUniforms.uTime.value = timeSec;
    this.routeLineUniforms.uProgress.value = this.progress;

    if (cfg.orbitMotionMode === "pdma-orbit") {
      this.surfaceOrbitAngle += PDMA_AUTO_ROTATE_SPEED * n;
      this.fieldUniforms.uSurfaceOrbitX.value = PDMA_INITIAL_ROT_X;
      this.fieldUniforms.uSurfaceOrbitY.value = this.surfaceOrbitAngle;
    } else {
      this.surfaceOrbitAngle = 0;
      this.fieldUniforms.uSurfaceOrbitX.value = 0;
      this.fieldUniforms.uSurfaceOrbitY.value = 0;
    }

    if (!this.dragging) {
      if (cfg.orbitMotionMode !== "pdma-orbit") {
        this.spinAngle += ((cfg.spin ?? 0.06) * 0.016 + (1 - this.progress) * 0.014) * n;
      }
      this.spinAngle += this.flingX * n;
      const inertia = clamp(this.cfg.dragInertia ?? 0.5, 0, 1);
      // 50% preserves c78's 0.94 decay; the endpoints map to 0.5 and 0.99.
      const decayPerFrame = inertia <= 0.5
        ? 0.5 + (0.94 - 0.5) * (inertia / 0.5)
        : 0.94 + (0.99 - 0.94) * ((inertia - 0.5) / 0.5);
      this.flingX *= Math.pow(decayPerFrame, n);
      this.tiltAngle += ((cfg.tilt ?? 18) * DEG2RAD - this.tiltAngle) * decay(0.055);
    }

    const targetScale = this.fitScale() * (0.88 + 0.12 * this.progress);
    this.scale += (targetScale - this.scale) * decay(0.08);

    this.pivot.scale.setScalar(this.scale);
    this.pivot.position.set(cfg.offsetX || 0, cfg.offsetY || 0, 0);
    this.pivot.rotation.y += (this.spinAngle - this.pivot.rotation.y) * decay(0.1);
    this.pivot.rotation.x += (this.tiltAngle - this.pivot.rotation.x) * decay(0.1);
    this.trackCursor(delta);
    if (this.field) this.field.renderOrder = cfg.cursorMode !== "off" && this.cursorGain > 0.02 ? 4 : 1;
    this.renderer.render(this.scene, this.camera);
    this.placeProjection();
  };

  disposeField() {
    if (this.field) {
      this.pivot.remove(this.field);
      this.field.geometry.dispose();
      this.field = null;
    }
  }

  disposeRoutes() {
    for (let i = this.routeGroup.children.length - 1; i >= 0; i--) {
      const child = this.routeGroup.children[i] as THREE.Mesh | THREE.Points;
      child.geometry?.dispose();
      this.routeGroup.remove(child);
    }
  }

  dispose() {
    if (this.raf !== null) cancelAnimationFrame(this.raf);
    this.raf = null;
    this.resizeWatcher?.disconnect();
    this.viewWatcher?.disconnect();
    this.host.removeEventListener('pointerdown', this.onDown);
    this.host.removeEventListener('pointerleave', this.onLeave);
    window.removeEventListener('pointermove', this.onMove);
    window.removeEventListener('pointerup', this.onUp);
    window.removeEventListener('pointercancel', this.onUp);

    this.disposeField();
    this.disposeRoutes();
    this.fieldMaterial.dispose();
    this.atmosphere.geometry.dispose();
    this.atmosphere.material.dispose();
    this.routeMaterial.dispose();
    this.routeLineMaterial.dispose();
    this.scene.clear();
    this.renderer.forceContextLoss();
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.remove();
    }
  }
}
