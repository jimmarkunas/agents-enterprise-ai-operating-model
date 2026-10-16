/**
 * Landmask decoder & distance field sampler
 * Recreated with exact precision from Framer delicate-lychee runtime
 */

export const G_ = 448;
export const K_ = 224;

export const q_ = `LR3iWfC1291A1W622w12~1Sa7Q14t221J1w23g89M6b1k6X1B123329O29z6326Y2cC1Z19c29c2W57234k4z2E1751~27~8444G1x289137.3i3X4a528522232dax2H11U17D1hw49utscx3Z1e65566452724X45g32fsL1$26x1vw1853Y3uy15~2I1H29G4ca345254239qI1Z24tF11.655g5Y23eY16134g5Z2E1x1b5224123412131319D472d1446125ipE1$24h4311x2ddC11pH317d5s7V1E1kp35216i43A19n2mof212bl6.54rgE1R1dJ172H3d2bb2S32555w1lR1x1jd5664245h3l4vk2fw284e73688kvS1rj15218352C82u335w1W1rdb3257291347225~1eaeC3.614bdpX1y1422v2G81y121253qy12onafb31~2227b2a3E38d33cijbw1e3d6~a3f3dvamfhf561y383h1bU25413b314hdq2y1e3y63B63e.Z1bh225pX2B1X2b131231263k9Y1f4N52fcc242F56fX18s8kV2A1h141y2kat4Y1g4E5513ar87B55hZ11o16alZ1641e31D1a21eV1kc33.S2f7Y43474I14mN497j2D2ikP1p4T1313oP1jjC24f125721L4m8G19mO46433d4C2jeU1u3M13y1U1clA24d2248M4n8K18oL4a222c4A2n.6Y1C12P2Y13sX1534ax522j6N15gI56624W1s4X132R315V14tV13473K5f3T12f22H528w2s3W1y4S222~171J522W222J581~12352G212.A412C24254y212L522X213P5Z186F212F412E277Z1P531Y215H32g1N1~12cG2I4G21121F2E1333d6G3F3G36j3D1G2K2I4C223J2h3i52.3c6G362V257G34adh343bL214B2G4z2I2g31553efa4D377V2112cw369736c36316gH2A2G4w2M2de53c384a7Z2d2~23e82Q24s1121141.561acN2~1H4$1M2ca272345s5P22223g3$23f39M26s4441kcN2Z1J4X1P2ak1643s6M294d3x33b45R24t528321158aP2W1M4W1P21254d.d16S35495y3a448F311sg42S2V1O4U1T2lr22F38268F3412dG3vmU2P1W4L1U2puH3a311S32bH3g28uU2K1Z4I1V2w14a324I3b1C4~32y.1V2E122$423t4213V2E22W2N4U23g121R1U22915m21z512jh2T2G24T2P4R25g3V1Q23ih23y542gi3P2X13g631L2R4K2117h3Y1O22jf3.1E523ek1N2$13i513H2R413~1d42j2~1J21pcM514bC3w24pcZ132O425W1cq3x2M24ia42P59h134I2z23pcr1rF522k5meo3z2G23a2c9x.21U11~1b75b4E2z23nii7i32I533g9gjm4y2z2423c57b$11Y3c36g125x2y25kkecf32~42ifddlj3A2A2162ciz6gW2A24hmbfgg3M43fd.13fbqc4C2V2dI623623Q2C24cr8i12ee2O41efl8ta2E2O2cX6aP2F227w17lfe121H4221ea22m7B121G2P26B75P2H2D17m248e141D414.1f842m7t29F2z24d4F73a9y2F246u6m256g311E411141f371n4w1N2W111g94I782jX1M2w1321l262n2B45s2m221x1M2V1o15P713oV1K.2B13l2r123A4481i3m2D1H2W1ow8p21T1f4T1w23g292L45e442X1S17bS1uw8vT11g22M1Y1424d6W45c414Z1L1H2x1$7z1H2K1~1413a8.K41b98215y2J1F2A1X7B1F2I1A258c7122w4232223b66C2G1G2B1U7E1D2G1D257a31z44a2113975F2F1B2H1S7J1A2D1G266833e234x3.81332843766I2B1$1P1T7S1Z1A1K24a253d11dJ228cg211h4L2z1Z1S1S7V1X1x1N23h121ib4111D222c41x12Q2x1X1V1T7U1Y1x1O242.2x1c91C2ctaQ2x1X1U1W7T1Y1x1V25313241f733$11f2r241A3x1Z1R1Z7Q1Z1y1z3141t3P21$3z1Z1Q1~7N1~1z1O31b1X2277M3z1~1N.1w8M1w2z192A3863V247822~229A1~1L1z8K1~1A184Z2d75q1X156fY267z1~1J1E8G1w2y167Y2i45r1d2G172lX268w1w2E1L8D1w2v96.X2uD11I1vW26auw2D1M8D1x2rc6T2A1L2E1R25bsz2B1M8B1z2sa6Q2G1j1y12kI1O269sB2A1M8z1C2ra6O2J1F2K1P25aqG2w1M8uI2pc4.O2M1B2M1Q23doK2sL8tK2nA3O1y2N1B3mL2tK8tL2lC3N1y2N1C3kN2sK8sO2iE3M1y2M1F3hQ2qK8qR2gF3M1z2q5fI3dU2oK8nV2cJ3cbn.B2lebK3aV2nK8mW24R35j21hI11rgp3Q613iH8kQ7et1d2tdR7kF8kS7cv275y1312W7jF8dD9473C9fE8eE91c3t5B8bE8dA83t4g3t2B8b.11E8az94k6x9cC8ay95o5z9aB8bAjbB8aZd1G5aA88Ij8A88a4Zi8D88Cj8K8411W$4131A9111zb1S72Z84L47C11g575k7w3w13n114121.26x1dI44U83G4j34hO2M2U2bz191W34P8317z33eM16G3M1L36C227P2813G8818~1132332Q24X3oY33A3Z1738q7w6131d1p9X1B7pD7T1.g52125c47s1K47fO1V1z7z1B7U1C3Q2A3P1H7E1N7X1V2y2F3Q1R7A1Y7a6A1z343H137~2z189V7I1J7hab1jV2C253A3478abS7K1~737f.Q3w2Q35O8x1NcG14oNcaOcsU13TO2`.split(`.`).join(``);

const J_ = `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$~`;
let Y_: Record<string, number> | null = null;

const X_ = (char: string): number => {
  if (!Y_) {
    Y_ = {};
    for (let e = 0; e < 64; e++) Y_[J_[e]] = e;
  }
  return Y_[char] ?? 0;
};

export const decodeLandmask = (): Uint8Array => {
  const e = new Uint8Array(G_ * K_);
  const t = new Uint8Array(G_ * K_);
  let n = 0;
  let r = 0;
  let i = 0;
  while (n < q_.length && r < t.length) {
    let val = 0;
    let shift = 0;
    let chunk = 0;
    do {
      chunk = X_(q_[n++]);
      val |= (chunk & 31) << shift;
      shift += 5;
    } while (chunk & 32 && n < q_.length);
    const s = Math.min(r + val, t.length);
    if (i) t.fill(1, r, s);
    r = s;
    i ^= 1;
  }
  let a = 0;
  for (let row = 0; row < K_; row++) {
    const rowOffset = row * G_;
    if (row & 1) {
      for (let col = G_ - 1; col >= 0; col--) e[rowOffset + col] = t[a++];
    } else {
      for (let col = 0; col < G_; col++) e[rowOffset + col] = t[a++];
    }
  }
  return e;
};

export const computeDistanceField = (e: Uint8Array): Float32Array => {
  const width = G_;
  const height = K_;
  const SQRT2 = 1.41421356;
  const pass = (targetVal: number) => {
    const arr = new Float32Array(width * height);
    for (let idx = 0; idx < arr.length; idx++) {
      arr[idx] = e[idx] === targetVal ? 0 : 1e6;
    }
    const wrapX = (x: number) => (x < 0 ? x + width : x >= width ? x - width : x);
    const update = (tgt: number, src: number, dist: number) => {
      const d = arr[src] + dist;
      if (d < arr[tgt]) arr[tgt] = d;
    };
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        update(idx, y * width + wrapX(x - 1), 1);
        if (y > 0) {
          const prevRow = (y - 1) * width;
          update(idx, prevRow + x, 1);
          update(idx, prevRow + wrapX(x - 1), SQRT2);
          update(idx, prevRow + wrapX(x + 1), SQRT2);
        }
      }
    }
    for (let y = height - 1; y >= 0; y--) {
      for (let x = width - 1; x >= 0; x--) {
        const idx = y * width + x;
        update(idx, y * width + wrapX(x + 1), 1);
        if (y < height - 1) {
          const nextRow = (y + 1) * width;
          update(idx, nextRow + x, 1);
          update(idx, nextRow + wrapX(x - 1), SQRT2);
          update(idx, nextRow + wrapX(x + 1), SQRT2);
        }
      }
    }
    return arr;
  };
  const outside = pass(0);
  const inside = pass(1);
  const result = new Float32Array(width * height);
  for (let idx = 0; idx < result.length; idx++) {
    result[idx] = e[idx] ? outside[idx] - 0.5 : 0.5 - inside[idx];
  }
  return result;
};

let cachedDistanceField: Float32Array | null = null;
export const getDistanceField = (): Float32Array => {
  if (!cachedDistanceField) {
    try {
      cachedDistanceField = computeDistanceField(decodeLandmask());
    } catch {
      cachedDistanceField = new Float32Array(G_ * K_);
    }
  }
  return cachedDistanceField;
};

export const sampleLandDistance = (u: number, v: number): number => {
  const field = getDistanceField();
  const fx = u * G_ - 0.5;
  const fy = v * K_ - 0.5;
  const x0 = Math.floor(fx);
  const y0 = Math.floor(fy);
  const sx = fx - x0;
  const sy = fy - y0;
  const wrapX = (x: number) => ((x % G_) + G_) % G_;
  const clampY = (y: number) => (y < 0 ? 0 : y >= K_ ? K_ - 1 : y);

  const xA = wrapX(x0);
  const xB = wrapX(x0 + 1);
  const rowA = clampY(y0) * G_;
  const rowB = clampY(y0 + 1) * G_;

  const h0 = field[rowA + xA] * (1 - sx) + field[rowA + xB] * sx;
  const h1 = field[rowB + xA] * (1 - sx) + field[rowB + xB] * sx;
  return h0 * (1 - sy) + h1 * sy;
};

export const DEG2RAD = Math.PI / 180;
export const TWO_PI = Math.PI * 2;
export const clamp = (v: number, min: number, max: number): number =>
  v < min ? min : v > max ? max : v;

export const createPrng = (seed: number) => {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
};

export interface FieldPointsData {
  position: Float32Array;
  seed: Float32Array;
  coast: Float32Array;
  count: number;
}

export const generateFieldPoints = (targetCount: number): FieldPointsData => {
  const estDots = Math.max(64, Math.round(targetCount / 0.292));
  const spacing = Math.sqrt((4 * Math.PI) / estDots);
  const rings = Math.max(3, Math.round(Math.PI / spacing));
  const prng = createPrng(2654435769 ^ estDots);
  const positions: number[] = [];
  const seeds: number[] = [];
  const coasts: number[] = [];

  for (let ring = 0; ring < rings; ring++) {
    const phi = (Math.PI * (ring + 0.5)) / rings;
    const countInRing = Math.max(1, Math.round((TWO_PI * Math.sin(phi)) / spacing));
    const offsetTheta = prng() * TWO_PI;
    const deltaPhi = Math.PI / rings;
    const deltaTheta = TWO_PI / countInRing;

    for (let i = 0; i < countInRing; i++) {
      const jitteredPhi = phi + (prng() - 0.5) * deltaPhi * 0.85;
      const jitteredTheta = offsetTheta + (i + (prng() - 0.5) * 0.85) * deltaTheta;
      const sinPhi = Math.sin(jitteredPhi);
      const x = sinPhi * Math.sin(jitteredTheta);
      const y = Math.cos(jitteredPhi);
      const z = sinPhi * Math.cos(jitteredTheta);

      const u = 0.5 + Math.atan2(x, z) / TWO_PI;
      const v = clamp(0.5 - Math.asin(clamp(y, -1, 1)) / Math.PI, 0, 1);
      const dist = sampleLandDistance(u - Math.floor(u), v);

      if (dist > 0) {
        positions.push(x, y, z);
        seeds.push(prng() * 512);
        coasts.push(clamp(dist / 6, 0, 1));
      }
    }
  }

  return {
    position: new Float32Array(positions),
    seed: new Float32Array(seeds),
    coast: new Float32Array(coasts),
    count: seeds.length,
  };
};

/** Deterministic full-sphere Fibonacci distribution for the dot-orb surface. */
export const generateSpherePoints = (targetCount: number): FieldPointsData => {
  const count = Math.max(0, Math.floor(targetCount));
  const position = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  const coast = new Float32Array(count);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = 1 - 2 * ((i + 0.5) / count);
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;
    position[i * 3] = Math.cos(theta) * radius;
    position[i * 3 + 1] = y;
    position[i * 3 + 2] = Math.sin(theta) * radius;
    seed[i] = ((i * 2654435761) >>> 0) / 8388608;
    coast[i] = 0;
  }

  return { position, seed, coast, count };
};
