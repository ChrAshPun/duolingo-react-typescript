export type Word = {
  spa: string,
  eng: string,
};

export type SettingsContext = {
  timer: number,
  setTimer: React.Dispatch<React.SetStateAction<number>>,
  hearts: number,
  setHearts: React.Dispatch<React.SetStateAction<number>>,
};

export type Match = {
  spaWord: string,
  spaIndex: number,
  engWord: string,
  engIndex: number,
}

export type selectedWord = {
  index: number,
  word: string,
}