"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Maximize, Minimize } from "lucide-react";
import { createContext, useContext, useRef } from "react";
import { usePresentationFullscreen } from "@/hooks/usePresentationFullscreen";
import { usePresentationNavigation } from "@/hooks/usePresentationNavigation";
import { PresentationTocDialog } from "@/components/presentation/PresentationTocDialog";
import { PresentationCanvas, PresentationCanvasOverlayProvider } from "@/components/presentation/PresentationCanvas";
import type { PresentationNavigationCopy } from "@/lib/presentation";
import { PresentationTitleBlock } from "@/components/presentation/PresentationTitleBlock";
import type { PresentationSlideManifestEntry } from "@/components/presentation/presentationTypes";
import { usePresentationReducedMotion } from "@/components/presentation/presentationMotion";

const PresentationTitleContext = createContext<{ slide: number; config: PresentationSlideManifestEntry["title"] } | null>(null);

export function PresentationTitleBlockOverlay() {
  const title = useContext(PresentationTitleContext);
  return title ? <PresentationTitleBlock slide={title.slide} config={title.config} /> : null;
}

export function PresentationSlideCanvas({ children }: { children: React.ReactNode }) {
  return <PresentationCanvas>{children}</PresentationCanvas>;
}

function PresentationHeader({ current, total, labels, brandLabel }: { current: number; total: number; labels: readonly [string, string, string]; brandLabel: string }) {
  const reduced = usePresentationReducedMotion();
  return <motion.header className="pdma-global-header" initial={reduced ? false : { opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
    <div className="pdma-global-row"><span className="pdma-global-label">{brandLabel}</span><span className="pdma-global-rail"><motion.i initial={reduced ? false : { scaleX: 0 }} animate={{ scaleX: (current + 1) / total }} /></span><span className="pdma-global-right"><b>{labels[0]}</b><em>•</em><b>{labels[1]}</b><em>•</em><b>{labels[2]}</b></span></div>
  </motion.header>;
}

function PresentationBottomBar({ current, total, footer, navigation, onPrev, onNext, onToc, onFullscreen, isFullscreen, brandAsset }: { current:number; total:number; footer:string; navigation:PresentationNavigationCopy; onPrev:()=>void; onNext:()=>void; onToc:()=>void; onFullscreen:()=>void; isFullscreen:boolean; brandAsset:string }) {
  const reduced = usePresentationReducedMotion();
  return <motion.footer className="pdma-bottom-bar" initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
    <div className="pdma-bottom-identity"><img src={brandAsset} alt="" /><i /><span>{footer}</span></div>
    <div className="pdma-bottom-controls"><button onClick={onPrev} aria-label={navigation.previousAriaLabel}><ChevronLeft /></button><button onClick={onNext} aria-label={navigation.nextAriaLabel}><ChevronRight /></button></div>
    <div className="pdma-bottom-right"><button className="pdma-count" onClick={onToc} aria-label={navigation.openTocAriaLabel} aria-haspopup="dialog">{current + 1} / {total}</button><button onClick={onFullscreen} aria-label={navigation.toggleFullscreenAriaLabel}>{isFullscreen ? <Minimize /> : <Maximize />}</button></div>
  </motion.footer>;
}

export function PresentationShell({ slides, slideManifest, navigation, brandLabel, brandAsset, tocDialogId }: { slides: React.ReactNode[]; slideManifest: readonly PresentationSlideManifestEntry[]; navigation:PresentationNavigationCopy; brandLabel:string; brandAsset:string; tocDialogId:string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggleFullscreen } = usePresentationFullscreen({ containerRef });
  const { currentSlide, isTocOpen, setIsTocOpen, nextSlide, prevSlide, jumpToSlide } = usePresentationNavigation({ slideCount: slides.length, onToggleFullscreen: toggleFullscreen });
  const reduced = usePresentationReducedMotion();
  const currentManifestEntry = slideManifest[currentSlide];
  return <main ref={containerRef} className="pdma-presentation">
    <PresentationTitleContext.Provider value={{ slide: currentSlide + 1, config: currentManifestEntry.title }}><PresentationCanvasOverlayProvider overlay={<PresentationTitleBlockOverlay />}><div className="pdma-stage"><AnimatePresence mode="wait" initial={false}><motion.div key={currentSlide} className="pdma-slide-layer" initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }} transition={{ duration: reduced ? 0 : 0.45, ease: "easeOut" }}>{slides[currentSlide]}</motion.div></AnimatePresence></div></PresentationCanvasOverlayProvider></PresentationTitleContext.Provider>
    <PresentationHeader current={currentSlide} total={slides.length} labels={currentManifestEntry.headerLabels} brandLabel={brandLabel} />
    <PresentationBottomBar current={currentSlide} total={slides.length} footer={currentManifestEntry.footerLabel} navigation={navigation} onPrev={prevSlide} onNext={nextSlide} onToc={() => setIsTocOpen(true)} onFullscreen={toggleFullscreen} isFullscreen={isFullscreen} brandAsset={brandAsset} />
    <PresentationTocDialog dialogId={tocDialogId} isOpen={isTocOpen} currentSlide={currentSlide} slideTitles={slideManifest.map(({ tocTitle }) => tocTitle)} slideIdOrder={slideManifest.map(({ id }) => id)} totalSlides={slides.length} navCopy={navigation} onClose={() => setIsTocOpen(false)} onJumpToSlide={jumpToSlide} />
  </main>;
}
