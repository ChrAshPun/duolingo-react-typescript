import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./GameSettings.module.css";
import { Link } from "react-router-dom";
import { Context } from '../App'
import { SettingsContext } from "../model";

const GameSettings: React.FC = () => {
  const {timer, setTimer, hearts, setHearts} = useContext(Context) as SettingsContext
  const [backBtnDown, setBackBtnDown] = useState<boolean>(false);

  const backRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (![-1,3].includes(hearts)) {
      setHearts(3)
    }
    if (backRef.current) {
      backRef.current.addEventListener('mousedown', () => setBackBtnDown(true));
      backRef.current.addEventListener('mouseup', () => setBackBtnDown(false));
    }
  }, [])

  return (
    <div className={styles.Container}>
      <div className={styles.Box}>
        <h1>Game Settings</h1>
        <div className={styles.Content}>
          <div className={styles.Row}>
            <h3>Timer:</h3>
            <div className={styles.SmBtnBg}>
              <button
                onClick={() => setTimer(60)}
                className={`${styles.SmBtn} ${(timer === 60 ? styles.SmBtnDown : styles.SmBtnUp)}`}
              >60</button>
            </div>
            <div className={styles.SmBtnBg}>
              <button 
                onClick={() => setTimer(90)} 
                className={`${styles.SmBtn} ${(timer === 90 ? styles.SmBtnDown : styles.SmBtnUp)}`}
              >90</button>
            </div>
          </div>
          <div className={styles.Row}>
            <h3>Hearts:</h3>
            <div className={styles.SmBtnBg}>
              <button
                onClick={() => setHearts(-1)}
                className={`${styles.SmBtn} ${(hearts === -1 ? styles.SmBtnDown : styles.SmBtnUp)}`}
              >Infinite</button>
            </div>
            <div className={styles.SmBtnBg}>
              <button 
                onClick={() => setHearts(3)} 
                className={`${styles.SmBtn} ${(hearts === 3 ? styles.SmBtnDown : styles.SmBtnUp)}`}
              >3</button>
            </div>
          </div>
        </div>
        <div className={styles.BackBtnBg}>
          <Link className={styles.Link} to="/">
            <button ref={backRef} className={styles.BackBtn + ' ' + (backBtnDown ? styles.BackBtnDown : styles.BackBtnUp)}>Back</button>
          </Link>
        </div>
      </div>
      <p className={styles.Footer}>Project by Christina Punla</p>
    </div>
  )
}

export default GameSettings