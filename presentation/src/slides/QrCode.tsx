import qrcode from "qrcode-generator";

/** Renders the QR code locally as SVG, so the end card needs no network or image service. */
export function QrCode({ value }: { value: string }) {
  const qr = qrcode(0, "M");
  qr.addData(value);
  qr.make();
  const count = qr.getModuleCount();
  const quiet = 2;
  let path = "";
  for (let r = 0; r < count; r++) for (let c = 0; c < count; c++) if (qr.isDark(r, c)) path += `M${c + quiet} ${r + quiet}h1v1h-1z`;
  const size = count + quiet * 2;
  return <svg viewBox={`0 0 ${size} ${size}`} shapeRendering="crispEdges" role="img" aria-label={`QR code for ${value}`}>
    <rect width={size} height={size} fill="#fff" />
    <path d={path} fill="#004679" />
  </svg>;
}
