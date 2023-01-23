import React from "react";
import styles from "./HeartIcon.module.css";

const HeartIcon: React.FC = () => {
return (
    <div className={styles.HeartContainer}>
      <div className={styles.LeftHeart}></div>
      <div className={styles.RightHeart}></div>
    </div>
  )
}

export default HeartIcon