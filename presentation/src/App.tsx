import { useEffect, useState } from "react";
import Pdma2026Presentation from "./app/pdma2026-2/presentation/Pdma2026Presentation";
import { PdmaExerciseRoute } from "./app/pdma2026-2/exercise/PdmaExerciseRoute";

export default function App() {
  const [exercise, setExercise] = useState(() => location.hash === "#exercise");
  useEffect(() => {
    const onHash = () => setExercise(location.hash === "#exercise");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return <div className="pdma2026-page pdma2026-production pdma2026-2-page">
    {exercise ? <>
      <PdmaExerciseRoute />
      <a href="#" style={{ position: "fixed", top: 16, right: 16, zIndex: 100, padding: "8px 12px", background: "#004679", color: "#fff", borderRadius: 8 }}>Return to slides</a>
    </> : <Pdma2026Presentation />}
  </div>;
}
