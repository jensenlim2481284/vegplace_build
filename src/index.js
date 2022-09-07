import React from "react";
import {createRoot} from "react-dom/client";
import App from "./App";
import "./assets/style/index.css";
import * as serviceWorker from "./services/serviceWorker";

const root = createRoot(document.getElementById("root"));
root.render(<App />);
serviceWorker.unregister();
