import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Portuguese from "./pages/Portuguese";
import Home from "./pages/English";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="BR" element={<Portuguese />} />
          <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}