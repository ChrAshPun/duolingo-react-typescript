import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../App";
import { SettingsContext, Word } from "../model";
import GameOver from "./GameOver";
import MatchGame from "./MatchGame";
import styles from "./MatchGamePage.module.css";

const MatchGamePage: React.FC = () => {
  const {timer, setTimer, hearts, setHearts} = useContext(Context) as SettingsContext
  
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [wordList, setWordList] = useState<Array<Word>>([])
  const [heartsCopy, setHeartsCopy] = useState(hearts)
  const [playerWon, setPlayerWon] = useState<boolean>(false)
  const [playerLost, setPlayerLost] = useState<boolean>(false)
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameOn, setGameOn] = useState<boolean>(true);

  const resetStates = async () => {
    setIsLoaded(false)
    setHeartsCopy(hearts)
    setPlayerWon(false)
    setPlayerLost(false)
    setGameOver(false)
    setGameOn(true)
    await getWordList()
  }

  const getWordList = async () => {
    const querySize: string = (timer === 60) ? '45' : '60';
    await axios.get(
      "https://54.90.61.223:8000/api/spanishdict/",
      { params: { sample: querySize }},
    )
      .then((res) => {
        setWordList(res.data)
        setIsLoaded(true)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    resetStates()
  },[])
    
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
  const delayGameOff = async () => {
    await delay(2500)
    setGameOn(false)
  }
  useEffect(() => {
    if (gameOver) {
      delayGameOff()
    }
  }, [gameOver])

  useEffect(() => {
    if (playerWon || playerLost) {
      setGameOver(true)
      delayGameOff()
    }
  },[playerWon, playerLost])

  return (
    <>
      { isLoaded ? 
        <div className={styles.Container}>
          { gameOn ? 
            <MatchGame 
              wordList={wordList}
              heartsCopy={heartsCopy}
              setHeartsCopy={setHeartsCopy}
              setPlayerWon={setPlayerWon}
              setPlayerLost={setPlayerLost}
              gameOver={gameOver}
            />
            :
            <GameOver 
              heartsCopy={heartsCopy}
              playerWon={playerWon}
              playerLost={playerLost}
              resetStates={resetStates}
            />
          }
        </div>
        : 
        <div className={styles.Container}></div> 
      }
    </>
  )
}

export default MatchGamePage