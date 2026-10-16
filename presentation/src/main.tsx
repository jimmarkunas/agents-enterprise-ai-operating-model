import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./tailwind.css";
import "./app/pdma2026-2/index.css";
import "./components/presentation/templates/templates.css";
import "./app/pdma2026-2/presentation/presentation.css";
import "./app/pdma2026-2/exercise/pdmaScenarioExercise.css";

const root = document.getElementById("root");
if (!root) throw new Error("Presentation root not found");
createRoot(root).render(<React.StrictMode><App /></React.StrictMode>);
