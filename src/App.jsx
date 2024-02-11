import { Route, Routes } from "react-router-dom";

import "./App.css";
import LoginPage from "./pages/LoginPage";
import GamePage from "./pages/GamePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />}></Route>
      <Route path="/game">
        <Route path=":gameId" element={<GamePage />} />
      </Route>
    </Routes>
  );
}

export default App;
