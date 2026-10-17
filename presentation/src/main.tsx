import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./brand/brand.css";
import "./slides/slides.css";

const root = document.getElementById("root");
if (!root) throw new Error("Presentation root not found");
createRoot(root).render(<React.StrictMode><App /></React.StrictMode>);
