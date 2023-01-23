import React from "react";
import styles from "./AlarmClockIcon.module.css";

type props = {
  gameOver: boolean,
}

const AlarmClockIcon: React.FC<props> = ({ gameOver }) => {
  return (
    <div className={styles.ClockContainer}>
      <div className={styles.ClockLeftBellContainer}>
        <div className={styles.ClockLeftBell}></div>
      </div>
      <div className={styles.ClockRightBellContainer}>
        <div className={styles.ClockRightBell}></div>
      </div>
      <div className={styles.ClockTop}>
        <div className={styles.ClockTopHorizontal}></div>
        <div className={styles.ClockTopVertical}></div>
      </div>
      <div className={styles.ClockOuter}>
        <div className={styles.ClockCenter}></div>
        <div className={styles.ClockSmallHand}></div>
        <div className={`
          ${styles.ClockBigHand} 
          ${gameOver ? styles.PauseAnimations : styles.Tick}
        `}></div>       
      </div>
    </div>
  )
}

export default AlarmClockIcon