"use client";

// 리엑트 컴포넌트와 모듈 임포트
import { useEffect, useState, useRef } from "react";
import styles from './page.module.css'; // CSS 모듈 임포트

export default function SpeakingLesson() {
  const [isRecording, setIsRecording] = useState(false); // 녹음 상태를 관리하는 변수
  const [transcript, setTranscript] = useState(""); // 녹음된 발음을 텍스트화 시킨 변수
  const [audioURL, setAudioURL] = useState(null); // 오디오 URL을 저장할 변수
  const [problemIndex, setProblemIndex] = useState(1); // 문제 번호 변수
  const [isPlaying, setIsPlaying] = useState(false); // 오디오 재생 상태를 관리하는 변수

  // Reference to store the SpeechRecognition instance
  const recognitionRef = useRef(null); // 녹음이 되고 있는지를 저장할 변수
  const mediaRecorderRef = useRef(null); // MediaRecorder 인스턴스를 저장할 변수
  const audioChunksRef = useRef([]); // 오디오 청크들을 저장할 변수
  const audioRef = useRef(null); // 오디오 요소 참조


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

     // 영어로만 음성 인식하도록 설정
    recognitionRef.current.lang = 'en-US';  // 영어(미국)로 설정

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

  // 녹음된 오디오 재생 함수
  const startMyAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();  // 오디오 재생 시작
      setIsPlaying(true);  // 재생 상태로 업데이트
    }
  };

  // 오디오가 끝난 후, 상태 업데이트
  const handleAudioEnd = () => {
    setIsPlaying(false); // 오디오가 끝났으므로 정지 상태로 업데이트
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
            <div className={styles.voiceButtons}>
              <button className={styles.autoVoice}>
                <div className={styles.autoElements}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                    <path d="M11.1538 0.568777C11.3047 0.632301 11.4336 0.738879 11.5243 0.875196C11.6149 1.01151 11.6634 1.17153 11.6637 1.33525V19.6639C11.6637 19.828 11.6152 19.9884 11.5244 20.125C11.4336 20.2617 11.3045 20.3684 11.1532 20.432C11.0019 20.4955 10.8353 20.5129 10.6742 20.4821C10.513 20.4513 10.3646 20.3736 10.2474 20.2588L5.37031 15.4683H2.49937C1.83649 15.4683 1.20077 15.205 0.732048 14.7363C0.263326 14.2676 0 13.6318 0 12.969V7.9869C0 7.32403 0.263326 6.6883 0.732048 6.21958C1.20077 5.75086 1.83649 5.48753 2.49937 5.48753H5.37197L10.2491 0.738734C10.3663 0.624356 10.5147 0.547074 10.6756 0.516549C10.8365 0.486024 11.0029 0.505277 11.1538 0.568777ZM9.99747 3.30808L6.29341 6.91884C6.13742 7.07092 5.92808 7.15586 5.71022 7.15544H2.49937C2.27841 7.15544 2.0665 7.24322 1.91026 7.39946C1.75402 7.5557 1.66625 7.76761 1.66625 7.98857V12.969C1.66625 13.1899 1.75402 13.4018 1.91026 13.5581C2.0665 13.7143 2.27841 13.8021 2.49937 13.8021H5.71189C5.92998 13.8021 6.13936 13.8877 6.29507 14.0404L9.99747 17.6778V3.30808ZM13.5149 5.81412C13.583 5.72839 13.6674 5.65694 13.7631 5.60384C13.8589 5.55074 13.9642 5.51704 14.073 5.50466C14.1818 5.49228 14.2919 5.50147 14.3972 5.53169C14.5024 5.56192 14.6006 5.61259 14.6863 5.68082L14.6896 5.68248L14.693 5.68582L14.7013 5.69248L14.7263 5.71414L14.8029 5.78079C14.864 5.83633 14.9429 5.9152 15.0395 6.0174C15.2278 6.22235 15.4728 6.5206 15.7144 6.91717C16.1992 7.71697 16.6691 8.905 16.6691 10.4963C16.6691 12.0859 16.1992 13.2756 15.7144 14.0754C15.5199 14.3975 15.2939 14.6995 15.0395 14.9768C14.9325 15.0909 14.8202 15.1998 14.7029 15.3034L14.6896 15.315H14.688C14.688 15.315 13.9431 15.7199 13.5166 15.1851C13.3794 15.0135 13.3156 14.7946 13.339 14.5762C13.3624 14.3577 13.4711 14.1574 13.6416 14.0187L13.6449 14.0154L13.6749 13.9887C13.706 13.9609 13.7532 13.9137 13.8165 13.8471C13.9949 13.6511 14.1535 13.4379 14.2897 13.2106C14.6396 12.6357 15.0029 11.741 15.0029 10.4946C15.0029 9.24825 14.6396 8.35681 14.2897 7.78362C14.1181 7.501 13.9122 7.24074 13.6765 7.00882L13.6465 6.98215C13.4746 6.84441 13.3643 6.6442 13.3396 6.42531C13.315 6.20642 13.378 5.98666 13.5149 5.81412ZM16.3509 2.34833C16.2656 2.27774 16.1671 2.22486 16.0611 2.19278C15.9551 2.1607 15.8438 2.15006 15.7337 2.16148C15.6236 2.17291 15.5169 2.20617 15.4197 2.25932C15.3226 2.31247 15.2371 2.38444 15.1681 2.47103C15.0991 2.55763 15.0481 2.6571 15.018 2.76364C14.9879 2.87019 14.9793 2.98166 14.9928 3.09155C15.0062 3.20144 15.0415 3.30754 15.0964 3.40366C15.1514 3.49977 15.2249 3.58397 15.3128 3.65133L15.3311 3.66799L15.4178 3.74297C15.4977 3.81296 15.6094 3.92126 15.7527 4.06789C16.0359 4.36282 16.4192 4.80604 16.8024 5.39089C17.5689 6.55893 18.3354 8.27849 18.3354 10.5046C18.3419 12.3213 17.8083 14.0989 16.8024 15.6116C16.4192 16.1948 16.0359 16.6347 15.7527 16.928C15.6186 17.0673 15.4785 17.2007 15.3328 17.3279L15.3145 17.3445H15.3128C15.1446 17.4837 15.0378 17.6833 15.0153 17.9004C14.9928 18.1175 15.0563 18.3348 15.1924 18.5055C15.3284 18.6762 15.5259 18.7867 15.7426 18.8133C15.9592 18.8399 16.1776 18.7803 16.3509 18.6475L16.4058 18.6026L16.5308 18.4942C16.6358 18.3993 16.7808 18.2643 16.9524 18.086C17.4145 17.6061 17.8307 17.084 18.1954 16.5264C19.379 14.7417 20.007 12.6461 19.9999 10.5046C20.0043 8.36137 19.3767 6.26444 18.1954 4.47612C17.8306 3.91805 17.4151 3.39484 16.954 2.91318C16.7798 2.7323 16.5974 2.55939 16.4075 2.39498L16.3692 2.36332L16.3575 2.35333L16.3542 2.34999L16.3509 2.34833Z" fill="#1A1A1A"/>
                  </svg>
                  <p className={styles.voiceWord}>발음듣기</p>
                </div>
              </button>
              <button className={styles.myVoice} onClick={startMyAudio} disabled={isPlaying || !audioURL}>
                <div className={styles.myElements}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 3L21 12L5 21V3Z" stroke="#1A1A1A" stroke-width="1.5" stroke-linejoin="round"/>
                  </svg>
                  <p className={styles.voiceWord}>내 발음듣기</p>
                </div>
              </button>
            </div>
          </div>

          {/* 오디오 요소 */}
          {audioURL && (
            <audio
              ref={audioRef}
              src={audioURL}
              onEnded={handleAudioEnd}
              preload="auto"
              style={{ display: "none" }}  // 오디오 요소 숨기기
            />
          )}



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
              <p className={styles.mainInstruction}>{!isRecording ? "발음하기" : "발음 중..."}</p>
              <p className={styles.subInstruction}>{!isRecording ? "마이크를 누르고 발음하세요" : "발음이 끝나면 마이크를 눌러주세요"}</p>
            </div>

          </div>
        </main>

        <button className={styles.confirmButton} onClick={()=>{
          {/* 문제 인덱스 변경 및 그에 따른 그래프 변화 */}
          setProblemIndex(problemIndex+1);
        }}>확인</button>
      </div>
    </div>
  );
}


// {/* 오디오 재생 버튼 */}
// {/* 최신 오디오 파일을 렌더링하며, 가장 최근 녹음만 표시하도록 함. 녹음된 오디오 다운로드 기능 삭제*/}
// <div className={styles.audioContainer}>
//   <audio className={styles.audioPlayer} key={audioURL} controlsList="nodownload" controls>
//     {audioURL ? (
//       <source src={audioURL} type="audio/wav" />
//     ) : (
//       <track kind="descriptions" label="No audio available" />
//     )}
//     브라우저에서 오디오 요소를 지원하지 않습니다.
//   </audio>
// </div>

// {/* 현재 녹음 상태를 보여줌 */}
// {(isRecording || transcript) && (
//   <div>
//     <div className={styles.status}>
//       <p>{!isRecording ? "녹음 완료" : "녹음 중"}</p>
//       <p>
//         {!isRecording ? "말해 주셔서 감사합니다." : "말씀을 시작하세요..."}
//       </p>
//     </div>
    
//     {/* 녹음된 음원의 텍스트 버전을 보여줌 */}
//     {transcript && (
//       <div className={styles.transcript}>
//         <p>{transcript}</p>
//       </div>
//     )}
//   </div>
// )}