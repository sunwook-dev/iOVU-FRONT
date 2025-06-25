import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import MuiProvider from "./mui/MuiProvider";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MuiProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MuiProvider>
  </React.StrictMode>
);

reportWebVitals();
