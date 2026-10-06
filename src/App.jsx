import { Routes, Route } from "react-router-dom";
import Games from "./pages/Games.jsx";
import GameHome from "./pages/GameHome.jsx";
import GameRedeem from "./pages/GameRedeem.jsx";
import GameOne from "./games/GameOne/Game.jsx";
import GameTwo from "./games/GameTwo/Game.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Games />} />
      <Route path="/games" element={<Games />} />
      <Route path="/games/:id" element={<GameHome />} />
      <Route path="/games/1/play" element={<GameOne />} />
      <Route path="/games/2/play" element={<GameTwo />} />
      <Route path="/redeem" element={<GameRedeem />} />
    </Routes>
  );
}
