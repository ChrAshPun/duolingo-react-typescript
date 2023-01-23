import React, { useContext, useEffect, useState } from "react";
import styles from "./HeadsUpDisplay.module.css";
import { Context } from '../App'
import { SettingsContext } from "../model";
import AlarmClockIcon from './AlarmClockIcon'
import HeartIcon from "./HeartIcon";
import InfinitySymbol from "./InfinitySymbol";

type props = {
  seconds: number,
  heartsCopy: number,
  gameOver: boolean,
}

const HeadsUpDisplay: React.FC<props> = ({ seconds, heartsCopy, gameOver }) => {
  const {timer, setTimer, hearts, setHearts} = useContext(Context) as SettingsContext

  const [digitalTime, setDigitalTime] = useState<string>('')

    // set digital time
    useEffect(() => {
      const min = Math.floor(seconds/60)
      let sec: string | number = seconds - (min*60)
      if (sec === 60 || sec == 0) {
        sec = '00'
      } else if (sec < 10) {
        sec = '0' + sec
      }
      setDigitalTime(min + ':' + sec)
    },[seconds])

  return (
    <>
    <div className={styles.Container}>
      {/* bar */}
      <div className={styles.Bar}>
        <div 
          className={`
            ${styles.Fill} 
            ${timer === 60 ? styles.OneMin : styles.TwoMin}
            ${gameOver ? styles.PauseAnimations : ''}
          `}
        >
          <div className={styles.FillHighlight}></div>
        </div>
      </div>
      {/* timer */}
      <AlarmClockIcon gameOver={gameOver} />
      <p className={styles.Timer}>{digitalTime}</p>
      {/* hearts */}
      <HeartIcon />
      {heartsCopy === -1 ? <InfinitySymbol /> : <p className={styles.NumHearts}>{heartsCopy}</p>}
    </div>
    </>
  )
}

export default HeadsUpDisplay