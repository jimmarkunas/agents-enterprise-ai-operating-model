"use client";

import { Fragment } from "react";
import { pdma2026Content } from "@/content/pdma2026-2";
import { PresentationShell } from "@/components/presentation/PresentationShell";
import { pdmaAssets } from "@/app/pdma2026-2/pdmaAssets";
import { assertPdma2026ManifestParity, pdma2026Manifest, renderPdma2026Slide } from "./pdma2026Manifest";
import { pdma2026Slides } from "./pdma2026Content";

/** The production PDMA 2026 deck, rendered through the shared presentation shell. */
export default function Pdma2026Presentation() {
  const slides = pdma2026Slides.map((content, index) => <Fragment key={pdma2026Manifest[index].key}>{renderPdma2026Slide(content)}</Fragment>);
  assertPdma2026ManifestParity(pdma2026Manifest, slides);
  return <PresentationShell slides={slides} slideManifest={[...pdma2026Manifest]} navigation={pdma2026Content.navigation} brandLabel="PDMA 2026" brandAsset={pdmaAssets.asterisk} tocDialogId="pdma2026-2-slide-toc" />;
}
