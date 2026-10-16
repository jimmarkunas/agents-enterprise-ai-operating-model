"use client";

import { useRef, type ReactNode } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Maximize, Minimize } from "lucide-react";

import type { PresentationBrandLogo, PresentationNavigationCopy } from "@/lib/presentation";
import { usePresentationFullscreen } from "@/hooks/usePresentationFullscreen";
import { usePresentationInsets } from "@/hooks/usePresentationInsets";
import { usePresentationNavigation } from "@/hooks/usePresentationNavigation";

import { PresentationSlideFrame } from "./PresentationSlideFrame";
import { PresentationTocDialog } from "./PresentationTocDialog";

type PresentationDeckProps = {
  dialogId: string;
  slides: ReactNode[];
  slideTitles: string[];
  slideIdOrder: string[];
  navigation: PresentationNavigationCopy;
  brandLogo?: PresentationBrandLogo;
  brandLogoPosition?: "left" | "right";
  footerCenterContent?: ReactNode | ((currentSlide: number, totalSlides: number) => ReactNode);
  reserveNavigationInset?: boolean;
};

export function PresentationDeck({
  dialogId,
  slides,
  slideTitles,
  slideIdOrder,
  navigation,
  brandLogo,
  brandLogoPosition = "right",
  footerCenterContent,
  reserveNavigationInset = true,
}: PresentationDeckProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const { isFullscreen, toggleFullscreen } = usePresentationFullscreen({
    containerRef,
  });

  const {
    currentSlide,
    isTocOpen,
    setIsTocOpen,
    nextSlide,
    prevSlide,
    jumpToSlide,
  } = usePresentationNavigation({
    slideCount: slides.length,
    onToggleFullscreen: toggleFullscreen,
  });

  const contentBottomInset = usePresentationInsets({
    containerRef,
    navRef,
    initialInset: reserveNavigationInset ? 95 : 0,
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 md:p-8">
      <div
        ref={containerRef}
        className="presentation-container overflow-hidden rounded-lg border border-finox-slate/20 shadow-2xl"
      >
        <div className="absolute left-0 top-0 z-50 h-1 w-full bg-finox-slate/20">
          <motion.div
            className="h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="absolute inset-x-0 top-0 overflow-hidden" style={{ bottom: `${contentBottomInset}px` }}>
          <PresentationSlideFrame
            isActive
            brandLogoSrc={brandLogo?.src}
            brandLogoAlt={brandLogo?.alt}
            brandLogoPosition={brandLogoPosition}
          >
            {slides[currentSlide]}
          </PresentationSlideFrame>
        </div>

        <div
          ref={navRef}
          className="absolute bottom-4 left-0 z-50 flex w-full items-center justify-between px-4 sm:px-6 md:bottom-8 md:px-12"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex gap-4">
              <button
                onClick={prevSlide}
                className="group rounded-full border border-finox-slate/50 p-3 transition-colors hover:bg-white hover:text-finox-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                aria-label={navigation.previousAriaLabel}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextSlide}
                className="group rounded-full border border-finox-slate/50 p-3 transition-colors hover:bg-white hover:text-finox-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                aria-label={navigation.nextAriaLabel}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {footerCenterContent ? (
              <div className="flex min-w-0 items-center justify-start text-left">
                {typeof footerCenterContent === "function"
                  ? footerCenterContent(currentSlide, slides.length)
                  : footerCenterContent}
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={() => setIsTocOpen(true)}
              className="rounded px-2 py-1 font-mono text-sm tracking-widest text-finox-gray underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              aria-label={navigation.openTocAriaLabel}
              aria-haspopup="dialog"
              aria-expanded={isTocOpen}
              aria-controls={dialogId}
            >
              {currentSlide + 1} / {slides.length}
            </button>
            <button
              onClick={toggleFullscreen}
              className="rounded-full border border-finox-slate/50 p-3 transition-colors hover:bg-white hover:text-finox-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              aria-label={navigation.toggleFullscreenAriaLabel}
            >
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <PresentationTocDialog
          dialogId={dialogId}
          isOpen={isTocOpen}
          currentSlide={currentSlide}
          slideTitles={slideTitles}
          slideIdOrder={slideIdOrder}
          totalSlides={slides.length}
          navCopy={navigation}
          onClose={() => setIsTocOpen(false)}
          onJumpToSlide={jumpToSlide}
        />
      </div>
    </div>
  );
}
