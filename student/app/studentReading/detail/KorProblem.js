'use client';
import styles from '../../styles/studentReadingReProblem.module.css';
import { useState , useEffect } from 'react';
import Link from "next/link";
import { delay } from '@/app/util/utils';

export default function ContentDisplay({ title , unit , engContent, korContent, problemIndex , handleNext , handlePrevious }) {
  const [selectedWords, setSelectedWords] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [shuffledKorWords, setShuffledKorWords] = useState([]);
  const problemLength = engContent.length;

  const handleWordClick = (word) => {

    if(!selectedWords.includes(word)){
      setSelectedWords((prev) => [...prev, word]);
    }

  };

  const handleNextClick = async () => {
    const originKorWords = korContent[problemIndex].split(' ');

    if(selectedWords.length === originKorWords.length && selectedWords.every((word, index) => word ===  originKorWords[index])){
      if (problemIndex === engContent.length - 1) {
          // 마지막 문제에서 팝업 표시
          handleNext();
          await delay(1000); // 1초 동안 대기
          setShowPopup(true);
      } else {
          setSelectedWords([]) // 입력 값 초기화
          handleNext();  // 문제 번호를 증가시키는 함수 호출
      }
    } else{
      alert('틀렸는데용 ㅋ');
      setSelectedWords([])
    }
  };

  const handleReset = () => {
    setSelectedWords([]); // selectedWords 초기화
  };

  // 팝업을 닫을때 
  const closePopup = async () => {
    setShowPopup(false);
  }

  const shuffleWords = (text) => {
    const words = text.split(' ');
    // Fisher-Yates 알고리즘을 사용하여 배열을 랜덤하게 섞음
    for (let i = words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [words[i], words[j]] = [words[j], words[i]]; // swap
    }
    return words;
  };
  useEffect(() => {
    // 페이지가 처음 렌더링될 때만 단어를 섞음
    if (korContent[problemIndex]) {
      setShuffledKorWords(shuffleWords(korContent[problemIndex]));
    }
  }, [korContent, problemIndex]); // korContent나 problemIndex가 변경될 때마다 실행


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
            <p className={styles.progressInfo}>{problemIndex + 1} / {problemLength}</p>
          </div>
      </div>  

      <div className={styles.centralContainer}>
        <button className={styles.Resetbutton} onClick={handleReset}>
          {/* 나중에 이미지로 전환 */}
           &#8630;
        </button>
        <div className={styles.contentBlock}>
          <p className={styles.contentLine}>{engContent[problemIndex]}</p>
        </div>

        <div className={styles.contentBlock}>
          <h3 className={styles.contentHeading}>Korean Content:</h3>
          <div className={styles.koreanWords}>
            {shuffledKorWords.map((word, index) => (
              <span
                key={index}
                className={`${styles.koreanWordBlock} ${selectedWords.includes(word) ? styles.selected : ''}`}
                onClick={() => handleWordClick(word)}
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Words */}
      <div className={styles.selectedWordsContainer}>
        <h4>선택된 단어들:</h4>
        <p>{selectedWords.join(' ')}</p>
      </div>

      {/* Buttons */}
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={handlePrevious} disabled={problemIndex === 0}>
          Previous
        </button>
        <button
          className={styles.button}
          onClick={handleNextClick}
          disabled={selectedWords.length !== (korContent[problemIndex] ? korContent[problemIndex].split(' ').length : 0)}
        >
          Next
        </button>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2>🎉 학습 완료 🎉</h2>
            <p>수고하셨습니다! 이제 새로운 도전을 시작해 보세요.</p>
            <Link href='/' className={styles.popupButton} onClick={closePopup}>
              학습페이지로 돌아가기
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
