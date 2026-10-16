import { useCallback, useEffect, useState } from "react";

type UsePresentationNavigationParams = {
  slideCount: number;
  onToggleFullscreen: () => void;
};

export function usePresentationNavigation({
  slideCount,
  onToggleFullscreen,
}: UsePresentationNavigationParams) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTocOpen, setIsTocOpen] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  const jumpToSlide = useCallback((slideIndex: number) => {
    setCurrentSlide(slideIndex);
    setIsTocOpen(false);
  }, []);

  useEffect(() => {
    if (currentSlide < slideCount) return;
    setCurrentSlide(Math.max(0, slideCount - 1));
  }, [currentSlide, slideCount]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isTocOpen) {
        setIsTocOpen(false);
        return;
      }

      if (isTocOpen) return;

      if (event.key === "ArrowRight" || event.key === " ") nextSlide();
      if (event.key === "ArrowLeft") prevSlide();
      if (event.key === "f") onToggleFullscreen();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTocOpen, nextSlide, onToggleFullscreen, prevSlide]);

  return {
    currentSlide,
    isTocOpen,
    setIsTocOpen,
    nextSlide,
    prevSlide,
    jumpToSlide,
  };
}
