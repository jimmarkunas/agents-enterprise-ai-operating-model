"use client";

import { createPortal } from "react-dom";
import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { PRESENTATION_LOGICAL_CANVAS } from "./presentationTypes";

const DecorationContext = createContext<{ host: HTMLDivElement | null; extraWidth: number }>({ host: null, extraWidth: 0 });
const OverlayContext = createContext<ReactNode>(null);

export function PresentationCanvasOverlayProvider({ overlay, children }: { overlay: ReactNode; children: ReactNode }) {
  return <OverlayContext.Provider value={overlay}>{children}</OverlayContext.Provider>;
}

export function PresentationDecorativePlane({ children }: { children: ReactNode }) {
  const { host, extraWidth } = useContext(DecorationContext);
  return host ? createPortal(<div className="pdmat-slide pdma-decorative-plane" style={{ "--pdma-art-extra": `${extraWidth}px` } as CSSProperties}>{children}</div>, host) : <>{children}</>;
}

export function PresentationCanvas({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState({ scale: 1, left: 0, top: 0, extraWidth: 0 });
  const [decorHost, setDecorHost] = useState<HTMLDivElement | null>(null);
  const overlay = useContext(OverlayContext);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const update = () => {
      const scale = Math.min(stage.clientWidth / PRESENTATION_LOGICAL_CANVAS.width, stage.clientHeight / PRESENTATION_LOGICAL_CANVAS.height);
      const renderedWidth = PRESENTATION_LOGICAL_CANVAS.width * scale;
      const renderedHeight = PRESENTATION_LOGICAL_CANVAS.height * scale;
      const extraX = Math.max(0, stage.clientWidth - renderedWidth);
      const extraY = Math.max(0, stage.clientHeight - renderedHeight);
      setFrame({ scale, left: extraX / 2, top: extraY * 0.25, extraWidth: extraX / scale });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  return <DecorationContext.Provider value={{ host: decorHost, extraWidth: frame.extraWidth }}>
    <div ref={stageRef} className="pdma-canvas-stage">
      <div className="pdma-logical-canvas" style={{ left: frame.left, top: frame.top, transform: `scale(${frame.scale})` }}>
        <OverlayContext.Provider value={null}>{children}</OverlayContext.Provider>{overlay}
      </div>
      <div ref={setDecorHost} className="pdma-decoration-host" style={{ width: PRESENTATION_LOGICAL_CANVAS.width + frame.extraWidth, top: frame.top, transform: `scale(${frame.scale})` }} />
    </div>
  </DecorationContext.Provider>;
}
