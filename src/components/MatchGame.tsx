import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./MatchGame.module.css";
import "./styles.css"
import { Context } from '../App'
import { SettingsContext, Word, selectedWord } from "../model";
import { CSSTransition } from "react-transition-group";
import { useNavigate } from "react-router-dom";
import HeadsUpDisplay from "./HeadsUpDisplay";

type props = {
  wordList: Word[],
  heartsCopy: number,
  setHeartsCopy: React.Dispatch<React.SetStateAction<number>>,
  setPlayerWon: React.Dispatch<React.SetStateAction<boolean>>,
  setPlayerLost: React.Dispatch<React.SetStateAction<boolean>>,
  gameOver: boolean,
}

const MatchGame: React.FC<props> = ({ wordList, heartsCopy, setHeartsCopy, setPlayerWon, setPlayerLost, gameOver }) => {
  const {timer, setTimer, hearts, setHearts} = useContext(Context) as SettingsContext

  const [initGame, setInitGame] = useState<boolean>(true)
  const [copyWordList, setCopyWordList] = useState<Array<Word>>(wordList)

  const [columnSpanish, setColumnSpanish] = useState<Array<string>>([]);
  const [columnEnglish, setColumnEnglish] = useState<Array<string>>([]);

  const [selectedSpanish, setSelectedSpanish] = useState<selectedWord | null>(null);
  const [deselectedSpanish, setDeselectedSpanish] = useState<selectedWord | null>(null);
  const [selectedEnglish, setSelectedEnglish] = useState<selectedWord | null>(null);
  const [deselectedEnglish, setDeselectedEnglish] = useState<selectedWord | null>(null);

  const [numSelections, setNumSelections] = useState<number>(0);
  const [isMatch, setIsMatch] = useState<boolean>(false);

  const [isHovered, setIsHovered] = useState<boolean | undefined>(false);
  const [refillProcessIsRunning, setRefillProcessIsRunning] = useState<boolean>(false)
  const [timerDone, setTimerDone] = useState<boolean>(false)
  const [emptySlotsCount, setEmptySlotsCount] = useState<number>(0);

  const [ignoreSelect, setIgnoreSelect] = useState<boolean>(false);
  
  const navigate = useNavigate();

  const handleSpanishSelect = (index: number, word: string) => {
    console.log('handleSpanishSelect')
    console.log(index)
    if (!gameOver && !ignoreSelect) {
      if (selectedSpanish?.index === index) {
        console.log('setting to null')
        setSelectedSpanish(null)
        setDeselectedSpanish({index, word})
      } else {
        setDeselectedSpanish(null)
        setSelectedSpanish({index, word})
      }
    }
  }

  const handleEnglishSelect = (index: number, word: string) => {
    if (!gameOver && !ignoreSelect) {
      if (selectedEnglish?.index === index) {
        setSelectedEnglish(null)
        setDeselectedEnglish({index, word})
      } else {
        setDeselectedEnglish(null)
        setSelectedEnglish({index, word})
      }
    }
  }

  const addMatch = async () => {
    await delay(50)

    let copyColumnSpanish = [...columnSpanish];
    let copyColumnEnglish = [...columnEnglish];

    // get a random word
    const index: number = Math.floor(Math.random() * wordList.length);
    const word: Word = wordList[index];  

    // get index of "" in columnSpanish
    let random: number = Math.floor(Math.random() * 2)
    const indexSpanish: number = (random === 1) ? copyColumnSpanish.indexOf("") : copyColumnSpanish.lastIndexOf("");
    // get index of "" in columnEnglish
    random = Math.floor(Math.random() * 2)
    const indexEnglish: number = (random === 1) ? copyColumnEnglish.indexOf("") : copyColumnEnglish.lastIndexOf("");

    // update both columns
    copyColumnSpanish[indexSpanish] = word.spa;
    copyColumnEnglish[indexEnglish] = word.eng;
    setColumnSpanish(copyColumnSpanish);
    setColumnEnglish(copyColumnEnglish);

    setEmptySlotsCount(prevState => prevState - 1)
  }

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const handleIgnoreSelect = async () => {
    setIgnoreSelect(true)
    await delay(2000)
    setIgnoreSelect(false)
  }

  // initialize both columns
  const setupTimer = () => {
    setSeconds(timer) // reset timer
    setStartDate(currentDate)
  }
  const setupBothColumns = () => {
    let initSpanish: string[] = [];
    let initEnglish: string[] = [];
    const firstFiveWords: Word[] = copyWordList.slice(0,5)
    for (let i = 0; i < firstFiveWords.length; i++) {
      let random: number = Math.floor(Math.random() * 4) // 0,1,2,3
      if (random === 0) {
        initSpanish.unshift(firstFiveWords[i]['spa']) 
        initEnglish.unshift(firstFiveWords[i]['eng']) 
      } else if (random === 1) { 
        initSpanish.unshift(firstFiveWords[i]['spa']) 
        initEnglish.push(firstFiveWords[i]['eng']) 
      } else if (random == 2) {
        initSpanish.push(firstFiveWords[i]['spa']) 
        initEnglish.unshift(firstFiveWords[i]['eng']) 
      } else { 
        initSpanish.push(firstFiveWords[i]['spa']) 
        initEnglish.push(firstFiveWords[i]['eng']) 
      }
    }
    setColumnSpanish(initSpanish)
    setColumnEnglish(initEnglish)
  }
  useEffect(() => {
    setInitGame(true)
    setupTimer()
    setupBothColumns()
    setInitGame(false)
  },[])

  // always match check
  const matchCheck = async () => {
    if (selectedSpanish && selectedEnglish) {
      setNumSelections(2)
      const index: number = copyWordList.findIndex(word => word.spa === selectedSpanish.word)
      const match: Word = copyWordList[index]
      if (selectedSpanish.word === match?.spa && selectedEnglish.word === match?.eng) {
        setIsMatch(true)
        await delay(300) // add delay to allow green class

        // remove the match from both columns
        let copyColumnSpanish = [...columnSpanish];
        let copyColumnEnglish = [...columnEnglish];

        copyColumnSpanish[selectedSpanish.index] = "";
        copyColumnEnglish[selectedEnglish.index] = "";

        setColumnSpanish(copyColumnSpanish);
        setColumnEnglish(copyColumnEnglish);
        
        setSelectedSpanish(null)
        setSelectedEnglish(null)
        setNumSelections(0)

        // remove the word obj from copyWordList
        const newWordList = [...copyWordList]
        newWordList.splice(index, 1)
        setCopyWordList(newWordList)
      } else {
        setIsMatch(false)
        await delay(300) // add delay to allow red class

        setSelectedSpanish(null)
        setSelectedEnglish(null)
        setNumSelections(0)

        if (heartsCopy > 0) {
          setHeartsCopy(prevState => prevState - 1)
        }
      }
    } else if (selectedEnglish || selectedSpanish) {
      setIsMatch(false)
      setNumSelections(1)
    } else if (!selectedSpanish && !selectedEnglish) {
      setIsMatch(false)
      setNumSelections(0)
    }
  }
  useEffect(() => {
    matchCheck();
  },[selectedSpanish, selectedEnglish])

  ///// REFILL PROCESS - START /////

  const startRefillProcess = async () => { // after a match - startRefillProcess
    setRefillProcessIsRunning(true)
    await delay(2000)
    setTimerDone(true)
  }
  useEffect(() => {
    if (!initGame && columnSpanish.includes("")) { // the game field need to be refilled
      console.log("there's an empty slot")
      if (!refillProcessIsRunning) { // if the refillProcess is running, return
        console.log("running the timer")
        startRefillProcess() // first, run the timer
      } else if (refillProcessIsRunning) {
        console.log("refillProcessIsRunning...")
        return
      }
    }
  },[columnSpanish])

  // after timer's done, get total emptySlotsCount
  useEffect(() => {
    if (timerDone) {
      console.log('timer is done')
      const count: number = columnSpanish.reduce((count, str) => str === '' ? count + 1 : count, 0)
      console.log("total empty slots: " + count)
      setEmptySlotsCount(count)
    }
  },[timerDone])

  // add matches until count reaches zero, then reset
  useEffect(() => {
    if (emptySlotsCount > 0) {
      addMatch()
      console.log(emptySlotsCount)
    } else {
      setRefillProcessIsRunning(false)
      setTimerDone(false)
    }
  },[emptySlotsCount])

  ///// REFILL PROCESS - END /////

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [seconds, setSeconds] = useState<number>(timer);

  // update seconds
  const updateDate = () => {
    setCurrentDate(new Date())
  }
  useEffect(() => {
    if (!gameOver) {
      setSeconds(timer - Math.floor((currentDate.getTime() - startDate.getTime()) / 1000));
      
      const timeoutId = setInterval(updateDate, 1000)
      return () => clearTimeout(timeoutId);
    }
  }, [currentDate]);

  // gameOver listener - playerWon
  useEffect(() => {
    console.log(copyWordList)
    if (copyWordList.length === 0) {
      setPlayerWon(true)
    }
  },[copyWordList])
  // gameOver listener - playerLost
  useEffect(() => {
    if (seconds === 0 || heartsCopy === 0) {
      setPlayerLost(true)
    }
  },[seconds, heartsCopy])

  useEffect(() => {
    const wordBtns = document.getElementsByClassName("WordBtn")
    
    for (let i = 0; i < wordBtns.length; i++) {
      wordBtns[i].addEventListener('click', () => {
        console.log('clicked')
      })
    }
  },[])

  return (
    <div className={styles.Container}>
      <div 
        className={`
          ${styles.Box}
          ${gameOver ? styles.FadeOutMatchGame : ""}
        `}
      >
        <HeadsUpDisplay seconds={seconds} heartsCopy={heartsCopy} gameOver={gameOver} />
        <h3>Match all the words!</h3>
        <div className={styles.GameField}>
          {/* Column Spanish */}
          {/* <div className={styles.Column}>
            {copyWordList.map((word, index) => (
                <MatchGameBtn
                  index={index} 
                  word={word.spa}
                  selected={selectedSpanish}
                  numSelections={numSelections}
                  isMatch={isMatch}
                  handleSelect={handleSpanishSelect}
                />
              ) 
            )}
          </div> */}
          <div className={styles.Column}>
            {columnSpanish.map((word, index) => (
              <>
                {word ? 
                <div 
                  className={`
                    ${selectedSpanish?.index === index ? styles.PinkBg : styles.PurpleBg} 
                    ${
                      numSelections === 2 ?
                        selectedSpanish?.index === index ?
                          isMatch ? `${styles.GreenBg} ${styles.PurpleBg}` : `${styles.RedBg} ${styles.PurpleBg}`
                          : styles.PurpleBg
                        : styles.PurpleBg
                    }
                    ${styles.BtnBg} 
                    ${styles.FadeIn}
                  `}  
                  key={index}
                >
                  <button
                    onClick={() => handleSpanishSelect(index, word)}
                    className={`
                    ${deselectedSpanish?.index === index ? styles.PurpleBtn : styles.BtnDefault }
                    ${selectedSpanish?.index === index ? styles.PinkBtn : styles.BtnDefault }
                    ${
                      numSelections === 2 ?
                        selectedSpanish?.index === index ?
                          isMatch ? `${styles.GreenBtn} ${styles.BtnDefault}` : `${styles.RedBtn} ${styles.BtnDefault}`
                          : styles.BtnDefault
                        : styles.BtnDefault
                    }
                    `}
                    // ${isMatch && !awaitingSecondSelect ? styles.GreenBtn : styles.RedBtn}
                    // ${deselectedSpanish?.index === index && awaitingSecondSelect ? styles.PurpleBtn : ""}
                    // ${selectedSpanish?.index === index && awaitingSecondSelect ? styles.PinkBtn : styles.BtnDefault}
                  >
                    { word }
                  </button>
                </div>
                :
                <div className={styles.Placeholder} key={index}></div>
                }
              </>
            ))}
          </div>
          {/* Column English */}
          {/* <div className={styles.Column}>
            {copyWordList.map((word, index) => (
                <MatchGameBtn
                  index={index} 
                  word={word.eng}
                  selected={selectedEnglish}
                  numSelections={numSelections}
                  isMatch={isMatch}
                  handleSelect={handleEnglishSelect}
                />
              ) 
            )}
          </div> */}
          <div className={styles.Column}>
            {columnEnglish.map((word, index) => (
              <>
                {word ? 
                <div 
                  className={`
                    ${selectedEnglish?.index === index ? styles.PinkBg : styles.PurpleBg} 
                    ${
                      numSelections === 2 ?
                        selectedEnglish?.index === index ?
                          isMatch ? `${styles.GreenBg} ${styles.PurpleBg}` : `${styles.RedBg} ${styles.PurpleBg}`
                          : styles.PurpleBg
                        : styles.PurpleBg
                    }
                    ${styles.BtnBg} 
                    ${styles.FadeIn}
                  `}  
                  key={index}
                >
                  <button
                    onClick={() => handleEnglishSelect(index, word)}
                    className={`
                    ${deselectedEnglish?.index === index ? styles.PurpleBtn : styles.BtnDefault }
                    ${selectedEnglish?.index === index ? styles.PinkBtn : styles.BtnDefault }
                    ${
                      numSelections === 2 ?
                        selectedEnglish?.index === index ?
                          isMatch ? `${styles.GreenBtn} ${styles.BtnDefault}` : `${styles.RedBtn} ${styles.BtnDefault}`
                          : styles.BtnDefault
                        : styles.BtnDefault
                    }
                    `}
                    // ${isMatch && !awaitingSecondSelect ? styles.GreenBtn : styles.RedBtn}
                    // ${deselectedSpanish?.index === index && awaitingSecondSelect ? styles.PurpleBtn : ""}
                    // ${selectedSpanish?.index === index && awaitingSecondSelect ? styles.PinkBtn : styles.BtnDefault}
                  >
                    { word }
                  </button>
                </div>
                :
                <div className={styles.Placeholder} key={index}></div>
                }
              </>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.Footer}>
        <div className={styles.BottomBorder}></div>
        <div className={styles.Box}>
          <CSSTransition in={isHovered} timeout={200} classNames="exit-game-btn">
          {<div 
            className={styles.ExitGameBtn} 
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => {navigate('/')}}
          >
            Exit Game
          </div>
          }
          </CSSTransition>
        </div>
      </div>
    </div>
  )
}

export default MatchGame