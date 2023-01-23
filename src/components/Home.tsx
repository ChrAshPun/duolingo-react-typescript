import React, { useState, useEffect, useRef, useContext } from "react";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import { SettingsContext } from "../model";
import { Context } from "../App";

const Home: React.FC = () => {
  const {timer, setTimer, hearts, setHearts} = useContext(Context) as SettingsContext

  const [settingBtnDown, setSettingBtnDown] = useState<boolean>(false);
  const [playBtnDown, setPlayBtnDown] = useState<boolean>(false);

  const settingsRef = useRef<HTMLButtonElement>(null);
  const startgameRef = useRef<HTMLButtonElement>(null);

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const navigate = useNavigate();

  useEffect(() => {
    document.addEventListener('mouseup', () =>  {
      setSettingBtnDown(false)
      setPlayBtnDown(false)
    })
    if (startgameRef.current) {
      startgameRef.current.addEventListener('mousedown', () => setPlayBtnDown(true));
      startgameRef.current.addEventListener('mouseup', async () => {
        setPlayBtnDown(false);
        await delay(100);
        // setGameOver(false)
        navigate('/matchgame')
      });
    if (settingsRef.current) {
      settingsRef.current.addEventListener('mousedown', () => setSettingBtnDown(true));
      settingsRef.current.addEventListener('mouseup', async () => {
        setSettingBtnDown(false);
        await delay(100);
        navigate('/settings')
      });
    }
    }
  }, [])

  return (
    <div className={styles.Container}>
      <div className={styles.Box}>
        <h1>Match Game</h1>
        <h3>Match all the words before the timer runs out! </h3>
        <div className={styles.BtnBg}>
          <button ref={startgameRef} className={playBtnDown ? styles.BtnDown : styles.BtnUp}>Start Game</button>
        </div>
        <div className={styles.BtnBg}>
          <button ref={settingsRef} className={settingBtnDown ? styles.BtnDown : styles.BtnUp}>Settings</button>
        </div>
      </div>
      <p className={styles.Footer}>Project by Christina Punla</p>
    </div>
  )
}

export default Home