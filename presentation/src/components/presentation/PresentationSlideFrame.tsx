import { AnimatePresence, motion } from "motion/react";

import { presentationSlideMotion } from "@/lib/motion";

type PresentationSlideFrameProps = {
  children: React.ReactNode;
  isActive: boolean;
  brandLogoSrc?: string;
  brandLogoAlt?: string;
  brandLogoPosition?: "left" | "right";
};

export function PresentationSlideFrame({
  children,
  isActive,
  brandLogoSrc,
  brandLogoAlt = "",
  brandLogoPosition = "right",
}: PresentationSlideFrameProps) {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          initial={presentationSlideMotion.initial}
          animate={presentationSlideMotion.animate}
          exit={presentationSlideMotion.exit}
          transition={presentationSlideMotion.transition}
          className="slide-content relative h-full w-full overflow-hidden"
        >
          {brandLogoSrc ? (
            <img
              src={brandLogoSrc}
              alt={brandLogoAlt}
              aria-hidden="true"
              className={`pointer-events-none absolute top-16 h-[65px] w-[65px] ${
                brandLogoPosition === "left" ? "left-16" : "right-16"
              }`}
            />
          ) : null}
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
