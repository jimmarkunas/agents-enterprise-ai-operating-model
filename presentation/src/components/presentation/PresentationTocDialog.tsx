import { AnimatePresence, motion } from "motion/react";

import type { PresentationNavigationCopy } from "@/lib/presentation";

type PresentationTocDialogProps = {
  dialogId: string;
  isOpen: boolean;
  currentSlide: number;
  slideTitles: string[];
  slideIdOrder: string[];
  totalSlides: number;
  navCopy: PresentationNavigationCopy;
  onClose: () => void;
  onJumpToSlide: (slideIndex: number) => void;
};

export function PresentationTocDialog({
  dialogId,
  isOpen,
  currentSlide,
  slideTitles,
  slideIdOrder,
  totalSlides,
  navCopy,
  onClose,
  onJumpToSlide,
}: PresentationTocDialogProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="absolute inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/75 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            id={dialogId}
            role="dialog"
            aria-modal="true"
            aria-label={navCopy.tocDialogAriaLabel}
            className="w-full max-w-3xl overflow-hidden rounded-2xl border border-white/15 bg-[#1f1f1f] text-white shadow-2xl"
            style={{ maxHeight: "calc(100dvh - 3rem)" }}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <h3 className="text-lg font-medium text-white">{navCopy.tocTitle}</h3>
              <button
                type="button"
                onClick={onClose}
                className="rounded border border-white/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70 transition-colors hover:border-white/40 hover:bg-white/5 hover:text-white"
              >
                {navCopy.closeButtonLabel}
              </button>
            </div>

            <div className="max-h-[calc(100vh-10rem)] overflow-y-auto px-3 py-3">
              <ul className="space-y-2">
                {slideTitles.map((title, index) => {
                  const isActive = currentSlide === index;

                  return (
                    <li key={slideIdOrder[index]}>
                      <button
                        type="button"
                        onClick={() => onJumpToSlide(index)}
                        className={`flex w-full items-center gap-4 rounded-xl border px-4 py-3 text-left transition-colors ${
                          isActive
                            ? "border-white/45 bg-white/12 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
                            : "border-white/10 bg-white/[0.03] text-white/80 hover:border-white/30 hover:bg-white/8 hover:text-white"
                        }`}
                      >
                        <span className="w-16 shrink-0 font-mono text-xs uppercase tracking-[0.15em]">
                          {index + 1} / {totalSlides}
                        </span>
                        <span className="text-base font-light leading-tight">{title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
