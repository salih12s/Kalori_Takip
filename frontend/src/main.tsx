import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./app/App";
import { runCacheGuard } from "./utils/cache-reset";
import "./styles.css";

// Flush stale caches/service workers from older deployments before mounting.
runCacheGuard();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
