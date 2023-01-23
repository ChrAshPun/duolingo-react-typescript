import React, { useEffect, useRef, useState } from "react";
import { Word, selectedWord } from "../model";
import styles from "./MatchGameBtn.module.css";

type props = {
  index: number,
  word: string,
  selected: selectedWord | null,
  numSelections: number,
  isMatch: boolean,
  handleSelect: (index: number, word: string) => void,
}

type color = {
  color: string;
  border: string;
}

const purple = {
  'color': '#535EB1',
  'border': '3px solid #767EB9',
}
const pink = {
  'color': '#e37eb4',
  'border': '3px solid #e37eb4',
}

const green = {
  'color': '#46CB92',
  'border': '3px solid #46CB92',
}

const red = {
  'color': '#D95151',
  'border': '3px solid #D95151',
}

const MatchGameBtn: React.FC<props> = ({index, word, selected, numSelections, isMatch, handleSelect}) => {
  const [btnDown, setBtnDown] = useState<boolean>(false);
  const [color, setColor] = useState<color>(purple);
  const btnRef = useRef<HTMLButtonElement>(null);
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));


  const handleColor = () => {
    if (numSelections === 0) {
      console.log('setting to purple')
      setColor(purple)
    } else if (numSelections === 1) {
      console.log('setting to pink')
      if (index === selected?.index) {
        setColor(pink)
      }
    } else if (numSelections === 2) {
      const color = (isMatch) ? green : red
      setColor(color)
    }
  }
  useEffect(() => {
    handleColor();
  },[handleSelect])

  useEffect(() => {
    if (btnRef.current) {
      btnRef.current.addEventListener('mousedown', () => setBtnDown(true));
      btnRef.current.addEventListener('mouseup', () => {
        setBtnDown(false);
        console.log('handleSelect')
        handleSelect(index, word)
      });
    }
  }, [])

  return (
    <div className={styles.BtnBg}>
      <button
        ref={btnRef}
        style={color}
        className={`${btnDown ? styles.BtnDown : styles.BtnUp}`}
      >
        {word}
      </button>
    </div>
  )
}

export default MatchGameBtn