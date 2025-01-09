'use client'; 
import styles from '../../styles/studentReadingReProblem.module.css';
import { useState , useEffect } from 'react';
import Link from "next/link";
import { delay } from '@/app/util/utils';

export default function ContentDisplay({ title , unit , engContent, korContent, problemIndex , handleNext , handlePrevious }) {
  const [selectedWords, setSelectedWords] = useState([]);
  const [showEndPopup, setShowEndPopup] = useState(false);
  const [showNotPopup , setShowNotPopup] = useState(false);
  const [shuffledEngWords, setShuffledEngWords] = useState([]);
  const problemLength = korContent.length;

  const handleWordClick = (word) => {
    if (!selectedWords.includes(word)) {
      setSelectedWords((prev) => [...prev, word]);
    }
  };

  const handleNextClick = async () => {
    const originEngWords = engContent[problemIndex].split(' ');

    if (selectedWords.length === originEngWords.length && selectedWords.every((word, index) => word === originEngWords[index])) {
      if (problemIndex === korContent.length - 1) {
        handleNext();
        await delay(1000); // 1초 동안 대기
        setShowEndPopup(true);
      } else {
        setSelectedWords([]); // 입력 값 초기화
        handleNext(); // 문제 번호를 증가시키는 함수 호출
      }
    } else {
      setShowNotPopup(true);
      setSelectedWords([]);
    }
  };

  const handleReset = () => {
    setSelectedWords([]);
  };

  const closeEndPopup = async () => {
    setShowEndPopup(false);
  };

  const closeNotPopup = async () => {
    setShowNotPopup(false);
  };

  const shuffleWords = (text) => {
    const words = text.split(' ');
    for (let i = words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [words[i], words[j]] = [words[j], words[i]]; // swap
    }
    return words;
  };

  useEffect(() => {
    if (engContent[problemIndex]) {
      setShuffledEngWords(shuffleWords(engContent[problemIndex]));
    }
  }, [engContent, problemIndex]);

  return (
    <div>
      {/* Content Display */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2>{title}</h2>
          <p>Unit-{unit}</p>
        </div>
        {/* progressBar */}
        <div className={styles.progressContainer}>
          <div
            className={styles.progressBar}
            style={{
              '--ratio': problemIndex,
              '--total': problemLength,
            }}
          ></div>
          <p className={styles.progressInfo}>{problemIndex} / {problemLength}</p>
        </div>
      </div>  

      <div className={styles.centralContainer}>
        <button className={styles.Resetbutton} onClick={handleReset}>
          &#8630;
        </button>
        {/* Korea Content */}
        <div className={styles.contentBlock}>
          <p className={styles.contentLine}>{korContent[problemIndex]}</p>
        </div>

        {/* Selected Words */}
        <div className={styles.contentBlock}>
          <div className={styles.selectedWordsContainer}>
            <h4>Selected Words</h4>
            <div className={styles.selectedWordsList}>
              {selectedWords.map((word, index) => (
                <span key={index} className={styles.selectedWord}>
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* English Words */}
      <div className={styles.englishWords}>
        {shuffledEngWords.map((word, index) => (
          <span
            key={index}
            className={`${styles.englishWordBlock} ${selectedWords.includes(word) ? styles.selected : ''}`}
            onClick={() => handleWordClick(word)}
          >
            {word}
          </span>
        ))}
      </div>

      {/* Buttons */}
      <div className={styles.buttonContainer}>
        <button
          className={styles.button}
          onClick={handleNextClick}
          disabled={selectedWords.length !== (engContent[problemIndex] ? engContent[problemIndex].split(' ').length : 0)}
        >
          Next
        </button>
      </div>

      {/* Study End Popup */}
      {showEndPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2>🎉 학습 완료 🎉</h2>
            <p>수고하셨습니다! 이제 새로운 도전을 시작해 보세요.</p>
            <Link href='/' className={styles.popupButton} onClick={closeEndPopup}>
              학습페이지로 돌아가기
            </Link>
          </div>
        </div>
      )}
      
      {/* Study Not Answer */}
      {showNotPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2>틀렸습니다!</h2>
            <p>다시 한번 시도해 보세요!</p>
            <button className={styles.popupNotButton} onClick={closeNotPopup}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
