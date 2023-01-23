import React from "react";
import styles from "./InfinitySymbol.module.css";

const InfinitySymbol: React.FC = () => {
  return (
    <div className={styles.Infinity}>
      <div className={styles.LeftInfinity}></div>
      <div className={styles.RightInfinity}></div>
    </div>
  )
}

export default InfinitySymbol