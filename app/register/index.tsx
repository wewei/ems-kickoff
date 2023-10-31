import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const root = createRoot(document.getElementById("app-root") as HTMLDivElement);

root.render(<App />);