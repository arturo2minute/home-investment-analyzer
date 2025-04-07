import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchPage from "./SearchPage";
import BuyLiveRent from "./pages/BuyLiveRent";
import BuyRent from "./pages/BuyRent";
import HouseHack from "./pages/HouseHack";
import BRRRR from "./pages/BRRRR";
import FixFlip from "./pages/FixFlip";
import ShortTermRental from "./pages/ShortTermRental";
import Commercial from "./pages/Commercial";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/property/:id/buy_and_Live_and_rent" element={<BuyLiveRent />} />
        <Route path="/property/:id/buy_and_rent" element={<BuyRent />} />
        <Route path="/property/:id/brrrr" element={<BRRRR />} />
        <Route path="/property/:id/househack" element={<HouseHack />} />
        <Route path="/property/:id/fix_and_flip" element={<FixFlip />} />
        <Route path="/property/:id/short_term" element={<ShortTermRental />} />
        <Route path="/property/:id/commercial" element={<Commercial />} />
      </Routes>
    </Router>
  );
}

export default App;