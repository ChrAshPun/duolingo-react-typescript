import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./GameOver.module.css";
import { useNavigate } from "react-router-dom";
import { SettingsContext } from "../model";
import { Context } from "../App";

type props = {
  playerWon: boolean,
  playerLost: boolean,
  heartsCopy: number,
  resetStates: () => void,
}

const GameOver: React.FC<props> = ({ playerWon, playerLost, heartsCopy, resetStates }) => {
  const {timer, setTimer, hearts, setHearts} = useContext(Context) as SettingsContext
  
  const [message, setMessage] = useState<string>("");

  const [playagainBtnDown, setPlayAgainBtnDown] = useState<boolean>(false);
  const [playBtnDown, setPlayBtnDown] = useState<boolean>(false);

  const playagainRef = useRef<HTMLButtonElement>(null);
  const homeRef = useRef<HTMLButtonElement>(null);

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const navigate = useNavigate();
  
  useEffect(() => {
    document.addEventListener('mouseup', () =>  {
      setPlayAgainBtnDown(false)
      setPlayBtnDown(false)
    })
    if (playagainRef.current) {
      playagainRef.current.addEventListener('mousedown', () => setPlayAgainBtnDown(true));
      playagainRef.current.addEventListener('mouseup', async () => {
        setPlayAgainBtnDown(false);
        await delay(100);
        console.log('resetStates(false)')
        resetStates()
      });
    }
    if (homeRef.current) {
      homeRef.current.addEventListener('mousedown', () => setPlayBtnDown(true));
      homeRef.current.addEventListener('mouseup', async () => {
        setPlayBtnDown(false);
        await delay(100);
        navigate('/')
      });
    }
  })

  useEffect(() => {
    if (playerWon) {
      setMessage("Congratulations! You matched all the words!")
    } else if (playerLost) {
      if (heartsCopy === 0) {
        setMessage("You ran out of hearts!")
      } else {
        setMessage("Time's Up!")
      }
    }
  },[])

  return (
    <>
      <div className={styles.Box}>
        <h1>{ playerWon ? "You Win" : "Game Over"}</h1>
        <h3>{message}</h3>
        <div className={styles.BtnBg}>
          <button ref={playagainRef} className={playagainBtnDown ? styles.BtnDown : styles.BtnUp}>Play Again</button>
        </div>
        <div className={styles.BtnBg}>
          <button ref={homeRef} className={playBtnDown ? styles.BtnDown : styles.BtnUp}>Quit</button>
        </div>
      </div>
      <p className={styles.Footer}>Project by Christina Punla</p>
    </>
  )
}

export default GameOver