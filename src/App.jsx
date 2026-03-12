// src/App.jsx
// /        → Projector Display Screen
// /input   → Admin Score Input Panel

import { BrowserRouter, Routes, Route } from "react-router-dom";
import DisplayPage from "./pages/DisplayPage";
import InputPage from "./pages/InputPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DisplayPage />} />
        <Route path="/admin" element={<InputPage />} />
      </Routes>
    </BrowserRouter>
  );
}