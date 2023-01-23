import React, { createContext, useState } from 'react';
// import axios from 'axios';
import './App.css';
// import { SpanishWord } from './model';
import { SettingsContext } from './model';
import { Routes, Route, } from "react-router-dom";
import Home from "./components/Home"
import GameSettings from "./components/GameSettings"
import MatchGamePage from './components/MatchGamePage';

export const Context = createContext<SettingsContext | null>(null);

const App: React.FC = () => {

  const [timer, setTimer] = useState<number>(60);
  const [hearts, setHearts] = useState<number>(3);
  
  const value: SettingsContext = {timer, setTimer, hearts, setHearts};

  return (
    <Context.Provider value={value}>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<GameSettings />} />
          <Route path="/matchgame" element={<MatchGamePage />} />
      </Routes>
    </Context.Provider>
  )
}

export default App;
