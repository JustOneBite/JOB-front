"use client";

// 리엑트 컴포넌트와 모듈 임포트
import { useEffect, useState, useRef } from "react";
import styles from './page.module.css'; // CSS 모듈 임포트

export default function SpeakingLesson() {
  const [isRecording, setIsRecording] = useState(false); // 녹음 상태를 관리하는 변수
  const [transcript, setTranscript] = useState(""); // 텍스트 변환 결과를 관리하는 변수
  const [audioURL, setAudioURL] = useState(null); // 오디오 URL을 저장할 변수
  const [problemIndex, setProblemIndex] = useState(1); // 문제 번호 변수

  // Reference to store the SpeechRecognition instance
  const recognitionRef = useRef(null); // 녹음이 되고 있는지를 저장할 변수
  const mediaRecorderRef = useRef(null); // MediaRecorder 인스턴스를 저장할 변수
  const audioChunksRef = useRef([]); // 오디오 청크들을 저장할 변수

  // 녹음 시작 함수
  const startRecording = () => {
    setIsRecording(true);

    // 오디오 녹음을 위한 음원 녹음기 설정
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        // 새로운 녹음을 시작하기 전에 기존 오디오 청크를 초기화
        audioChunksRef.current = [];

        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          // 녹음이 종료되면 새로운 오디오 데이터 URL을 생성
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioURL(audioUrl); // 오디오 URL을 최신화
          audioChunksRef.current = []; // 다음 녹음을 위해 오디오 청크 초기화
        };

        mediaRecorderRef.current.start();
      })
      .catch((error) => console.error("Error accessing media devices.", error));

    // 새로운 SpeechRecognition 인스턴스를 생성하고 설정
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    // 음성인식 결과를 위한 Event handler
    recognitionRef.current.onresult = (event) => {
      const { transcript } = event.results[event.results.length - 1][0];
      setTranscript(transcript);
    };

    // 음성인식 시작
    recognitionRef.current.start();
  };

  // 페이지 전환을 하거나 컴포넌트가 언마운트 되면 음성인식, 미디어 녹음을 중지
  useEffect(() => {
    return () => {
      // 음성 인식(Recognition)이 활성화되어 있으면 중지
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
       // 2. 미디어 녹음(MediaRecorder)이 활성화 상태이면 중지
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);  // 빈 배열을 전달하여, 컴포넌트가 마운트될 때 한 번만 실행되고, 언마운트 시 실행되도록 함

  // 녹음 정지 함수
  const stopRecording = () => {
    // 음성 인식이 켜져있으면 중지
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    // 음성녹음이 켜져있으면 중지
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  // 녹음을 시작/중지 해주는 함수
  const handleToggleRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
      setIsRecording(false);
    }
  };

  const micButtonStyle = isRecording ? styles.micButtonRecording : styles.micButtonIdle;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>

        {/* 상단 헤더 */}
        <header className={styles.header}>
          <div className={styles.titleContainer}>
            <p className={styles.title}>Speaking</p>
            <p className={styles.lesson}>교재이름 - Unit 7</p>
          </div>
          <div className={styles.progressContainer}>
            <div className={styles.progressBar} style={{ '--ratio': problemIndex }}></div>
            <div className={styles.progressInfo}>
              {problemIndex} / 30
            </div>
          </div>
        </header>

        <p className={styles.instruction}>다음 문장을 발음해보세요</p>

        {/* 메인 컨텐츠 */}
        <main className={styles.main}>
          
          <div className={styles.sentenceBox}>
            <p className={styles.sentence}>Happy solo Christmas and a solo new year</p>
          </div>
          <div className={styles.recordBox}>
            <p className={styles.syncPercent}>목표 정확도 80%</p>
            <div className={styles.dots}>
              <div className={styles.lowPercentDot}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7.5" fill="#FEEDD2" stroke="#FFB54D"/>
                </svg>
                <p className={styles.percent}>-%</p>
              </div>
              <div className={styles.middlePercentDot}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7.5" fill="#FEEDD2" stroke="#FFB54D"/>
                </svg>
                <p className={styles.percent}>-%</p>
              </div>
              <div className={styles.highPercentDot}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7.5" fill="#FEEDD2" stroke="#FFB54D"/>
                </svg>
                <p className={styles.percent}>-%</p>
              </div>
            </div>
            {/* 마이크 버튼 */}
            <div className={styles.mic}>
              {/* Google Font 아이콘 불러오기 */}
              <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=mic" />
              {isRecording ? (
                <button onClick={handleToggleRecording} className={styles.micButton}><span className="material-symbols-outlined" style={{ fontSize: '50px' }}>mic</span></button>
              ) : (
                <button onClick={handleToggleRecording} className={styles.micButton}><span className="material-symbols-outlined" style={{ fontSize: '50px' }}>mic</span></button>
              )}
            </div>
            <div className={styles.micInstruction}>
              <p className={styles.mainInstruction}>발음하기</p>
              <p className={styles.subInstruction}>마이크를 누르고 발음하세요</p>
            </div>

          </div>
          
        </main>


        {/* 현재 녹음 상태를 보여줌 */}
        {(isRecording || transcript) && (
          <div>
            <div className={styles.status}>
              <p>{!isRecording ? "녹음 완료" : "녹음 중"}</p>
              <p>
                {!isRecording ? "말해 주셔서 감사합니다." : "말씀을 시작하세요..."}
              </p>
            </div>
            
            {/* 녹음된 음원의 텍스트 버전을 보여줌 */}
            {transcript && (
              <div className={styles.transcript}>
                <p>{transcript}</p>
              </div>
            )}
          </div>
        )}

      {/* 수평 컨트롤 영역 */}
      <div className={styles.horizontalControls}>
        
        

        {/* 오디오 재생 버튼 */}
        {/* 최신 오디오 파일을 렌더링하며, 가장 최근 녹음만 표시하도록 함. 녹음된 오디오 다운로드 기능 삭제*/}
        <div className={styles.audioContainer}>
          <audio className={styles.audioPlayer} key={audioURL} controlsList="nodownload" controls>
            {audioURL ? (
              <source src={audioURL} type="audio/wav" />
            ) : (
              <track kind="descriptions" label="No audio available" />
            )}
            브라우저에서 오디오 요소를 지원하지 않습니다.
          </audio>
        </div>
      </div>




        {/* 하단 확인 버튼 */}
        <footer className={styles.footer}>
          <button className={styles.confirmButton} onClick={()=>{
            {/* 문제 인덱스 변경 및 그에 따른 그래프 변화 */}
            setProblemIndex(problemIndex+1);
          }}>확인</button>
        </footer>
      </div>
    </div>
  );
}
