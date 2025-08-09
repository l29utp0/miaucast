import "react-app-polyfill/stable";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import { BrowserRouter, Routes, Route } from "react-router";
import ChatOverlay from "./app/components/chat/ChatOverlay";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/chat" element={<ChatOverlay />} />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
