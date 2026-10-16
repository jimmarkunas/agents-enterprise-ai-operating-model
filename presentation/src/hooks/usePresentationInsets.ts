import { useEffect, useState, type RefObject } from "react";

type UsePresentationInsetsParams = {
  containerRef: RefObject<HTMLDivElement>;
  navRef: RefObject<HTMLDivElement>;
  initialInset: number;
};

export function usePresentationInsets({
  containerRef,
  navRef,
  initialInset,
}: UsePresentationInsetsParams) {
  const [contentBottomInset, setContentBottomInset] = useState(initialInset);

  useEffect(() => {
    const container = containerRef.current;
    const nav = navRef.current;

    if (!container || !nav || typeof ResizeObserver === "undefined") return;

    const updateInset = () => {
      const containerRect = container.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();

      if (!containerRect.height || !navRect.height) return;

      const navTopInsideContainer = navRect.top - containerRect.top;
      const inset = Math.max(0, containerRect.height - navTopInsideContainer);
      setContentBottomInset(inset);
    };

    updateInset();

    const observer = new ResizeObserver(() => updateInset());
    observer.observe(container);
    observer.observe(nav);
    window.addEventListener("resize", updateInset);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateInset);
    };
  }, [containerRef, navRef]);

  return contentBottomInset;
}
