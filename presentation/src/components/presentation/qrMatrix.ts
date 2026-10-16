/**
 * Minimal QR Code Model 2 encoder (byte mode, error-correction level M, versions 1–10).
 * Produces the module matrix so the End Card QR is rendered natively from the same URL
 * value the CTA uses — no image, no base64, no dependency.
 */

// Level M tables, index = version.
const ECC_PER_BLOCK_M = [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26] as const;
const BLOCKS_M = [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5] as const;
const FORMAT_BITS_M = 0;

function rawDataModules(version: number) {
  let result = (16 * version + 128) * version + 64;
  if (version >= 2) {
    const alignCount = Math.floor(version / 7) + 2;
    result -= (25 * alignCount - 10) * alignCount - 55;
    if (version >= 7) result -= 36;
  }
  return result;
}

const dataCapacity = (version: number) => Math.floor(rawDataModules(version) / 8) - ECC_PER_BLOCK_M[version] * BLOCKS_M[version];

function gfMultiply(x: number, y: number) {
  let z = 0;
  for (let i = 7; i >= 0; i -= 1) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z & 0xff;
}

function rsDivisor(degree: number) {
  const result = new Array<number>(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i += 1) {
    for (let j = 0; j < result.length; j += 1) {
      result[j] = gfMultiply(result[j], root);
      if (j + 1 < result.length) result[j] ^= result[j + 1];
    }
    root = gfMultiply(root, 0x02);
  }
  return result;
}

function rsRemainder(data: readonly number[], divisor: readonly number[]) {
  const result = new Array<number>(divisor.length).fill(0);
  for (const byte of data) {
    const factor = byte ^ (result.shift() as number);
    result.push(0);
    divisor.forEach((coefficient, index) => { result[index] ^= gfMultiply(coefficient, factor); });
  }
  return result;
}

function alignmentPositions(version: number, size: number) {
  if (version === 1) return [];
  const count = Math.floor(version / 7) + 2;
  const step = Math.ceil((version * 4 + 4) / (count * 2 - 2)) * 2;
  const result = [6];
  for (let position = size - 7; result.length < count; position -= step) result.splice(1, 0, position);
  return result;
}

function encodeData(bytes: readonly number[], version: number) {
  const bits: number[] = [];
  const push = (value: number, length: number) => { for (let i = length - 1; i >= 0; i -= 1) bits.push((value >>> i) & 1); };
  push(0b0100, 4);
  push(bytes.length, version <= 9 ? 8 : 16);
  bytes.forEach((byte) => push(byte, 8));
  const capacityBits = dataCapacity(version) * 8;
  push(0, Math.min(4, capacityBits - bits.length));
  push(0, (8 - (bits.length % 8)) % 8);
  const codewords: number[] = [];
  for (let i = 0; i < bits.length; i += 8) codewords.push(bits.slice(i, i + 8).reduce((acc, bit) => (acc << 1) | bit, 0));
  for (let pad = 0xec; codewords.length < dataCapacity(version); pad ^= 0xec ^ 0x11) codewords.push(pad);
  return codewords;
}

function addEccAndInterleave(data: readonly number[], version: number) {
  const blockCount = BLOCKS_M[version];
  const eccLength = ECC_PER_BLOCK_M[version];
  const rawCodewords = Math.floor(rawDataModules(version) / 8);
  const shortBlocks = blockCount - (rawCodewords % blockCount);
  const shortBlockLength = Math.floor(rawCodewords / blockCount);
  const divisor = rsDivisor(eccLength);
  const blocks: number[][] = [];
  for (let i = 0, offset = 0; i < blockCount; i += 1) {
    const block = data.slice(offset, offset + shortBlockLength - eccLength + (i < shortBlocks ? 0 : 1));
    offset += block.length;
    const ecc = rsRemainder(block, divisor);
    if (i < shortBlocks) block.push(0);
    blocks.push([...block, ...ecc]);
  }
  const result: number[] = [];
  for (let i = 0; i < blocks[0].length; i += 1) {
    blocks.forEach((block, j) => { if (i !== shortBlockLength - eccLength || j >= shortBlocks) result.push(block[i]); });
  }
  return result;
}

function penalty(modules: boolean[][]) {
  const size = modules.length;
  let score = 0;
  const lineScore = (line: boolean[]) => {
    let runColor = line[0];
    let runLength = 1;
    for (let i = 1; i <= line.length; i += 1) {
      if (i < line.length && line[i] === runColor) { runLength += 1; continue; }
      if (runLength >= 5) score += 3 + (runLength - 5);
      if (i < line.length) { runColor = line[i]; runLength = 1; }
    }
    const pattern = [true, false, true, true, true, false, true];
    for (let i = 0; i + 7 <= line.length; i += 1) {
      if (!pattern.every((value, k) => line[i + k] === value)) continue;
      const before = line.slice(Math.max(0, i - 4), i);
      const after = line.slice(i + 7, i + 11);
      if ((i - 4 < 0 || before.every((value) => !value)) || (i + 11 > line.length || after.every((value) => !value))) score += 40;
    }
  };
  for (let y = 0; y < size; y += 1) lineScore(modules[y]);
  for (let x = 0; x < size; x += 1) lineScore(modules.map((row) => row[x]));
  for (let y = 0; y < size - 1; y += 1) {
    for (let x = 0; x < size - 1; x += 1) {
      const color = modules[y][x];
      if (color === modules[y][x + 1] && color === modules[y + 1][x] && color === modules[y + 1][x + 1]) score += 3;
    }
  }
  const dark = modules.reduce((sum, row) => sum + row.filter(Boolean).length, 0);
  const total = size * size;
  score += (Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1) * 10;
  return score;
}

const maskTest = [
  (x: number, y: number) => (x + y) % 2 === 0,
  (_x: number, y: number) => y % 2 === 0,
  (x: number) => x % 3 === 0,
  (x: number, y: number) => (x + y) % 3 === 0,
  (x: number, y: number) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
  (x: number, y: number) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x: number, y: number) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x: number, y: number) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
] as const;

export function createQrMatrix(text: string): boolean[][] {
  const bytes = Array.from(new TextEncoder().encode(text));
  let version = 1;
  while (version <= 10 && dataCapacity(version) * 8 < 4 + (version <= 9 ? 8 : 16) + bytes.length * 8) version += 1;
  if (version > 10) throw new Error("QR payload too long for versions 1–10");

  const size = version * 4 + 17;
  const modules = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  const reserved = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  const setFunction = (x: number, y: number, dark: boolean) => { modules[y][x] = dark; reserved[y][x] = true; };

  for (let i = 0; i < size; i += 1) { setFunction(6, i, i % 2 === 0); setFunction(i, 6, i % 2 === 0); }
  for (const [cx, cy] of [[3, 3], [size - 4, 3], [3, size - 4]]) {
    for (let dy = -4; dy <= 4; dy += 1) {
      for (let dx = -4; dx <= 4; dx += 1) {
        const distance = Math.max(Math.abs(dx), Math.abs(dy));
        const x = cx + dx; const y = cy + dy;
        if (x >= 0 && x < size && y >= 0 && y < size) setFunction(x, y, distance !== 2 && distance !== 4);
      }
    }
  }
  const aligns = alignmentPositions(version, size);
  aligns.forEach((ay, i) => aligns.forEach((ax, j) => {
    const last = aligns.length - 1;
    if ((i === 0 && j === 0) || (i === 0 && j === last) || (i === last && j === 0)) return;
    for (let dy = -2; dy <= 2; dy += 1) for (let dx = -2; dx <= 2; dx += 1) setFunction(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
  }));

  const drawFormat = (mask: number) => {
    const data = (FORMAT_BITS_M << 3) | mask;
    let remainder = data;
    for (let i = 0; i < 10; i += 1) remainder = (remainder << 1) ^ ((remainder >>> 9) * 0x537);
    const bits = ((data << 10) | remainder) ^ 0x5412;
    const bit = (i: number) => ((bits >>> i) & 1) !== 0;
    for (let i = 0; i <= 5; i += 1) setFunction(8, i, bit(i));
    setFunction(8, 7, bit(6)); setFunction(8, 8, bit(7)); setFunction(7, 8, bit(8));
    for (let i = 9; i < 15; i += 1) setFunction(14 - i, 8, bit(i));
    for (let i = 0; i < 8; i += 1) setFunction(size - 1 - i, 8, bit(i));
    for (let i = 8; i < 15; i += 1) setFunction(8, size - 15 + i, bit(i));
    setFunction(8, size - 8, true);
  };
  drawFormat(0);
  if (version >= 7) {
    let remainder = version;
    for (let i = 0; i < 12; i += 1) remainder = (remainder << 1) ^ ((remainder >>> 11) * 0x1f25);
    const bits = (version << 12) | remainder;
    for (let i = 0; i < 18; i += 1) {
      const dark = ((bits >>> i) & 1) !== 0;
      const a = size - 11 + (i % 3); const b = Math.floor(i / 3);
      setFunction(a, b, dark); setFunction(b, a, dark);
    }
  }

  const codewords = addEccAndInterleave(encodeData(bytes, version), version);
  let bitIndex = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vertical = 0; vertical < size; vertical += 1) {
      for (let j = 0; j < 2; j += 1) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? size - 1 - vertical : vertical;
        if (!reserved[y][x] && bitIndex < codewords.length * 8) {
          modules[y][x] = ((codewords[bitIndex >>> 3] >>> (7 - (bitIndex & 7))) & 1) !== 0;
          bitIndex += 1;
        }
      }
    }
  }

  const applyMask = (mask: number) => {
    for (let y = 0; y < size; y += 1) for (let x = 0; x < size; x += 1) if (!reserved[y][x] && maskTest[mask](x, y)) modules[y][x] = !modules[y][x];
  };
  let bestMask = 0;
  let bestPenalty = Infinity;
  for (let mask = 0; mask < 8; mask += 1) {
    applyMask(mask);
    drawFormat(mask);
    const score = penalty(modules);
    if (score < bestPenalty) { bestPenalty = score; bestMask = mask; }
    applyMask(mask);
  }
  applyMask(bestMask);
  drawFormat(bestMask);
  return modules;
}
