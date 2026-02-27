import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root");
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// react-snap pre-renders pages — hydrate if content already exists
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
