"use client";

// 리엑트 컴포넌트와 모듈 임포트
import { useEffect, useState, useRef } from "react";
import styles from './page.module.css'; // CSS 모듈 임포트

export default function Speaking() {
  const [isRecording, setIsRecording] = useState(false); // 녹음 상태를 관리하는 변수
  const [transcript, setTranscript] = useState(""); // 텍스트 변환 결과를 관리하는 변수
  const [audioURL, setAudioURL] = useState(null); // 오디오 URL을 저장할 변수

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

  // 이 함수는 컴포넌트가 언마운트될 때 실행됩니다
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
  }, []); // 빈 배열을 전달하여, 컴포넌트가 마운트될 때 한 번만 실행되고, 언마운트 시 실행되도록 함

  // 녹음 정지 함수
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  // 녹음 상태(시작/정지)를 전환하고 녹음 시작을 실행해주는 함수
  const handleToggleRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
      setIsRecording(false);
    }
  };

  // 녹음 상태에 따라 적절한 UI를 렌더링하는 부분
  return (
    <div className={styles.container}>
      <div>
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

        {/* 녹음 시작 정지 버튼 */}
        <div>
          {isRecording ? (
            <button onClick={handleToggleRecording} className={styles.btn}>중지</button>
          ) : (
            <button onClick={handleToggleRecording} className={styles.btn}>시작</button>
          )}
        </div>

        {/* 최신 오디오 파일을 렌더링하며, 가장 최근 녹음만 표시하도록 함 */}
        {audioURL && (
          <div className={styles.audioContainer}>
            <p>녹음된 오디오:</p>
            <audio key={audioURL} controls>
              <source src={audioURL} type="audio/wav" />
              브라우저에서 오디오 요소를 지원하지 않습니다.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
}
