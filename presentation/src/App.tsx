import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import logo from "./brand/pdma-logo.png";
import { slides } from "./slides/Slides";

const SLIDE_WIDTH = 1920;
const SLIDE_HEIGHT = 1080;

/** "#7" opens slide 7; anything else opens slide 1. */
function slideFromHash() {
  const n = Number.parseInt(location.hash.replace(/^#\/?/, ""), 10);
  return Number.isFinite(n) && n >= 1 && n <= slides.length ? n - 1 : 0;
}

function useFitScale() {
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / SLIDE_WIDTH, window.innerHeight / SLIDE_HEIGHT));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  return scale;
}

export default function App() {
  const [index, setIndex] = useState(slideFromHash);
  const scale = useFitScale();
  const deckRef = useRef<HTMLDivElement>(null);

  const go = useCallback((next: number) => setIndex(Math.max(0, Math.min(slides.length - 1, next))), []);
  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void deckRef.current?.requestFullscreen?.().catch(() => undefined);
  }, []);

  useEffect(() => {
    const target = `#${index + 1}`;
    if (location.hash !== target) history.replaceState(null, "", target);
    document.title = `${index + 1}/${slides.length} · ${slides[index].title} · PDMA Innovation in Focus`;
  }, [index]);

  useEffect(() => {
    const onHash = () => setIndex(slideFromHash());
    const onKey = (event: KeyboardEvent) => {
      // The embedded exercise owns its own keys; presenter clickers send PageUp/PageDown.
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      if ((event.target as HTMLElement | null)?.closest?.(".pdmax")) return;
      const forward = ["ArrowRight", "ArrowDown", "PageDown", " ", "Enter"];
      const back = ["ArrowLeft", "ArrowUp", "PageUp", "Backspace"];
      if (forward.includes(event.key) && !(event.target instanceof HTMLButtonElement || event.target instanceof HTMLAnchorElement)) { event.preventDefault(); setIndex((i) => Math.min(slides.length - 1, i + 1)); }
      else if (back.includes(event.key)) { event.preventDefault(); setIndex((i) => Math.max(0, i - 1)); }
      else if (event.key === "Home") setIndex(0);
      else if (event.key === "End") setIndex(slides.length - 1);
      else if (event.key === "f" || event.key === "F") toggleFullscreen();
    };
    window.addEventListener("hashchange", onHash);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("hashchange", onHash); window.removeEventListener("keydown", onKey); };
  }, [toggleFullscreen]);

  return <div className="deck" ref={deckRef}>
    <div className="deck__plane" style={{ transform: `scale(${scale}) translate(-50%, -50%)` }}>
      {slides.map((slide, i) => <section
        key={slide.title}
        className={`slide slide--${slide.layout}`}
        hidden={i !== index}
        aria-roledescription="slide"
        aria-label={`${i + 1} of ${slides.length}: ${slide.title}`}
      >
        {slide.render({ go })}
        <img className="chrome__logo" src={logo} alt="PDMA: Connecting Innovators Worldwide" />
        <div className="chrome__series" aria-label="Innovation in Focus, a monthly webcast series"><strong>INNOVATION IN FOCUS</strong><em>A Monthly Webcast Series</em></div>
        <span className="chrome__site" aria-hidden="true">PDMA.ORG</span>
        {slide.footer && <footer className="chrome__footer"><span className="chrome__footer-label">{slide.footer}</span><span className="chrome__footer-page">{String(i + 1).padStart(2, "0")} / {slides.length}</span></footer>}
      </section>)}
    </div>
    <nav className="deck__controls" aria-label="Presentation controls">
      <button type="button" onClick={() => go(index - 1)} aria-label="Previous slide">←</button>
      <span aria-live="polite">{index + 1} / {slides.length}</span>
      <button type="button" onClick={() => go(index + 1)} aria-label="Next slide">→</button>
      <button type="button" onClick={toggleFullscreen} aria-label="Toggle full screen">⛶</button>
    </nav>
    <div className="deck__progress" style={{ width: `${((index + 1) / slides.length) * 100}%` }} aria-hidden="true" />
  </div>;
}
