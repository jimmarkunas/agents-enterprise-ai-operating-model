import { useCallback, useEffect, useState, type RefObject } from "react";

type UsePresentationFullscreenParams = {
  containerRef: RefObject<HTMLDivElement>;
};

export function usePresentationFullscreen({
  containerRef,
}: UsePresentationFullscreenParams) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const syncFullscreenState = useCallback(() => {
    const isContainerFullscreen = document.fullscreenElement === containerRef.current;
    setIsFullscreen(isContainerFullscreen);
  }, [containerRef]);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
        return;
      }

      await document.exitFullscreen();
    } catch {
      syncFullscreenState();
    }
  }, [containerRef, syncFullscreenState]);

  useEffect(() => {
    syncFullscreenState();
    document.addEventListener("fullscreenchange", syncFullscreenState);

    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreenState);
    };
  }, [syncFullscreenState]);

  return {
    isFullscreen,
    toggleFullscreen,
  };
}
