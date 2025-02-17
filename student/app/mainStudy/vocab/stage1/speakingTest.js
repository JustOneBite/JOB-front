'use client'

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function SpeakingTest({ vocabs, onTestComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0); // 현재 단어 인덱스
    const [passResults, setPassResults] = useState(
        Array(vocabs.length).fill(false) // 초기값 false로 배열 생성
    );

    const [passedVocabCount, setPassedVocabCount] = useState(0);
    const initialArray = [null, null, null];
    const [testResult, setTestResult] = useState(initialArray);
    const [testTry, setTestTry] = useState(0);// 몇 번째 시도인지 확인하기 위한 변수

    const [shouldReset, setShouldReset] = useState(false);

    const [score, setScore] = useState(null);
    const [isToStudy, setIsToStudy] = useState(false);
    const [isToNextStage, setIsToNextStage] = useState(false);

    const [vocabBoxClass, setVocabBoxClass] = useState(styles.vocabBox); // 단어 박스 맞음/틀림 에 따른 상태
    const [recordedAudio, setRecordedAudio] = useState(null) // 사용자가 녹음한 음원


    const passThreshold = 70 // 임의의 통과 점수

    useEffect(() => {
        if (passResults[currentIndex] === false) {
            setVocabBoxClass(styles.vocabBoxFailed);

            const timer = setTimeout(() => {
                setVocabBoxClass(styles.vocabBox); // 3초 후 기본 스타일로 변경
            }, 3000);

            return () => clearTimeout(timer); // 컴포넌트가 사라질 때 타이머 정리
        }
    }, [recordedAudio])

    const handleSpeakVoice = (e) => {
        e.preventDefault()
        speakText(vocabs[currentIndex].english)
    }

    const speakText = (text) => {
        if (window.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.5;  // 음성 속도
            utterance.pitch = 1; // 음성 피치
            utterance.lang = "en-US"; // 음성 언어 설정

            // 음성을 시작
            window.speechSynthesis.speak(utterance);
        } else {
            alert("이 브라우저는 SpeechSynthesis를 지원하지 않습니다.");
        }
    }

    const handlePassUpdate = (index, isPassed) => {
        // 특정 단어의 결과 업데이트
        setPassResults((prevResults) => {
            const updatedResults = [...prevResults];
            updatedResults[index] = isPassed;
            return updatedResults;
        });

    };

    const handleNext = (e) => {
        if (e) e.preventDefault(); // e가 있을 때만 실행

        setPassedVocabCount(passedVocabCount + 1);

        // ALL PASS 인 경우 팝업 띄우고 다음 스테이지로
        if (currentIndex === vocabs.length - 1) {
            if (passResults.every((isPassed) => isPassed)) {
                toggleToNextStage();
                return;
            }
            else {
                toggleToStudy();
                return;
            }
        }
        else {
            setCurrentIndex(currentIndex + 1); // 다음 단어로 이동
            setShouldReset(!shouldReset)
            setScore(null)


            setTestResult(initialArray);
            setTestTry(0);
        }
    };

    const handlePass = (e) => {
        if (e) e.preventDefault(); // e가 있을 때만 실행

        //마지막 단어인데 Pass 했을 경우 학습페이지로 이동
        if (currentIndex === vocabs.length - 1) {
            toggleToStudy();
            return;
        }

        setCurrentIndex(currentIndex + 1); // 다음 단어로 이동


        setShouldReset(!shouldReset)
        setScore(null)

        setTestResult(initialArray);
        setTestTry(0);

    }

    const handleScoreUpdate = (newScore) => {
        setScore(newScore); // Update the score when VoiceRecording provides a new value


        const copy = [...testResult];
        copy[testTry] = newScore;
        setTestResult(copy);
        setTestTry(testTry + 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onTestComplete({ result: passResults, stage: 0 }); // 결과 배열 반환
    };

    const toggleToStudy = () => {
        setIsToStudy((prev) => !prev);
    };

    const toggleToNextStage = () => {
        setIsToNextStage((prev) => !prev);
    }

    const handleAudio = (newAudio) => {
        setRecordedAudio(newAudio);
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.exitBox}>
                    <button onClick={handleSubmit} className={styles.exitButton}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                            <path d="M15.64 30.8571L9 24M9 24L15.64 17.1429M9 24H29.5714M15.8571 8L34.1429 8.00457C36.6663 8.00686 38.7143 10.0526 38.7143 12.576V35.4217C38.7143 36.6341 38.2327 37.7969 37.3753 38.6542C36.518 39.5115 35.3553 39.9931 34.1429 39.9931L15.8571 40" stroke="#1A1A1A" strokeWidth="3.73469" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className={styles.exitWord}>나가기</p>
                    </button>
                </div>

                {/* 프로그레스 바 */}
                <div className={styles.progressBarDiv}>
                    프로그레스 바
                </div>

                <p className={styles.instruction}>단어를 발음해보세요</p>

                {/* 메인 컨텐츠 */}
                <div className={styles.mainContent}>
                    {/* 단어 박스 */}
                    <div className={score === null ? styles.vocabBox : (passResults[currentIndex] ? styles.vocabBoxPassed : vocabBoxClass)}>
                        <div className={styles.vocabWord}>
                            {/* 남은 단어가 있을 경우에는 단어를 띄움 */}
                            {(currentIndex <= vocabs.length - 1) && vocabs[currentIndex].english}
                        </div>
                        <button onClick={handleSpeakVoice} className={styles.computerVoice}>발음듣기</button>
                    </div>

                    <div className={styles.voiceControl}>
                        <p className={styles.targetAccuracy}>목표 정확도 {passThreshold}%</p>

                        <div className={styles.allBadges}>
                            <div className={styles.accBadge}>
                                <div className={testResult[0] === null ? styles.circle : (testResult[0] >= passThreshold ? styles.circlePassed : styles.circleFailed)}></div>
                                <p className={styles.percent}>{testResult[0] === null ? '-' : testResult[0]}%</p>
                            </div>
                            <div className={styles.accBadge}>
                                <div className={testResult[1] === null ? styles.circle : (testResult[1] >= passThreshold ? styles.circlePassed : styles.circleFailed)}></div>
                                <p className={styles.percent}>{testResult[1] === null ? '-' : testResult[1]}%</p>
                            </div>
                            <div className={styles.accBadge}>
                                <div className={testResult[2] === null ? styles.circle : (testResult[2] >= passThreshold ? styles.circlePassed : styles.circleFailed)}></div>
                                <p className={styles.percent}>{testResult[2] === null ? '-' : testResult[2]}%</p>
                            </div>
                        </div>

                        <div style={{ pointerEvents: testTry < 3 ? "auto" : "none" }}>
                            <VoiceRecording
                                passThreshold={passThreshold}
                                index={currentIndex} // 현재 단어의 인덱스 전달
                                onScoreUpdate={handleScoreUpdate}
                                onPassUpdate={handlePassUpdate}
                                shouldReset={shouldReset}
                                getAudio={handleAudio}
                            />
                        </div>
                    </div>
                </div>


                {/* 제출 버튼 */}
                <div className={styles.progressButtonContainer}>
                    <button className={styles.passButton} onClick={handlePass} >이 단어 건너뛰기</button>
                    <button className={styles.nextButton} onClick={handleNext} disabled={!passResults[currentIndex]}>확인</button>
                </div>

                {/* 단어 맞았을 때 팝업 */}
                {recordedAudio !== null && (!passResults[currentIndex] ? console.log("아직 틀림") : (
                    (passResults.every((isPassed) => isPassed)) ? <NextStagePopup handlesubmit={handleSubmit}/> : (
                        <div>
                            <VocabCorrectPopup />
                            <div style={{ display: "none" }}>
                                {setTimeout(() => handlePass(undefined), 500)}
                            </div>
                        </div>
                    )
                ))}

                {/* 단어 틀렸을 때 팝업 */}
                {recordedAudio !== null && (testTry == 3 ? (
                    <div>
                        <VocabNoChancePopup />
                        <div style={{ display: "none" }}>
                            {setTimeout(() => handlePass(undefined), 3000)}
                        </div>
                    </div>
                ) : console.log("이걸 다 틀리네 ㅋㅋ"))}

                {/* 학습하러가기 팝업 */}
                {isToStudy &&
                    (
                        <div className={styles.popupContainer}>
                            <div className={styles.card}>
                                <div className={styles.content}>
                                    <div className={styles.header}>
                                        <h1 className={styles.title}>Vocabulary 테스트 완료</h1>
                                        <div className={styles.stats}>
                                            <div className={styles.statText}>맞은 문제 수: {passedVocabCount}개</div>
                                            <div className={styles.wrongText}>틀린 문제 수: {vocabs.length - passedVocabCount}개</div>
                                        </div>
                                    </div>

                                    <div className={styles.checkmarkContainer}>
                                        <div className={styles.checkmarkCircle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
                                                <path d="M25.4658 40.4L48.0658 17.8C48.5992 17.2667 49.2214 17 49.9325 17C50.6436 17 51.2658 17.2667 51.7992 17.8C52.3325 18.3333 52.5992 18.9671 52.5992 19.7013C52.5992 20.4356 52.3325 21.0684 51.7992 21.6L27.3325 46.1333C26.7992 46.6667 26.177 46.9333 25.4658 46.9333C24.7547 46.9333 24.1325 46.6667 23.5992 46.1333L12.1325 34.6667C11.5992 34.1333 11.3432 33.5004 11.3645 32.768C11.3858 32.0356 11.6641 31.4018 12.1992 30.8667C12.7343 30.3316 13.3681 30.0649 14.1005 30.0667C14.833 30.0684 15.4658 30.3351 15.9992 30.8667L25.4658 40.4Z" fill="#0084D0" />
                                            </svg>
                                        </div>
                                    </div>

                                    <button className={styles.button} onClick={handleSubmit}>
                                        틀린 문항 공부하러가기
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {isToNextStage &&
                    (
                        <div className={styles.popupContainer}>
                            <div className={styles.card}>
                                <div className={styles.content}>
                                    <div className={styles.header}>
                                        <h1 className={styles.title}>Vocabulary 테스트 완료</h1>
                                        <div className={styles.stats}>
                                            <div className={styles.statText}>맞은 문제 수: 15개</div>
                                            <div className={styles.wrongText}>틀린 문제 수: 15개</div>
                                        </div>
                                    </div>

                                    <div className={styles.checkmarkContainer}>
                                        <div className={styles.checkmarkCircle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
                                                <path d="M25.4658 40.4L48.0658 17.8C48.5992 17.2667 49.2214 17 49.9325 17C50.6436 17 51.2658 17.2667 51.7992 17.8C52.3325 18.3333 52.5992 18.9671 52.5992 19.7013C52.5992 20.4356 52.3325 21.0684 51.7992 21.6L27.3325 46.1333C26.7992 46.6667 26.177 46.9333 25.4658 46.9333C24.7547 46.9333 24.1325 46.6667 23.5992 46.1333L12.1325 34.6667C11.5992 34.1333 11.3432 33.5004 11.3645 32.768C11.3858 32.0356 11.6641 31.4018 12.1992 30.8667C12.7343 30.3316 13.3681 30.0649 14.1005 30.0667C14.833 30.0684 15.4658 30.3351 15.9992 30.8667L25.4658 40.4Z" fill="#0084D0" />
                                            </svg>
                                        </div>
                                    </div>

                                    <button className={styles.button} onClick={handleSubmit}>
                                        다음 스테이지로
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>

    );
}

function EachWord({ vocab }) {

    return (
        <div>
            <h3>Word: {vocab.english}</h3>
            <p>Meaning: {vocab.korean}</p>
        </div>
    );
}

function VoiceRecording({ passThreshold, onPassUpdate, index, shouldReset, onScoreUpdate, getAudio }) {

    const [isRecording, setIsRecording] = useState(false);
    const [isPlayable, setIsPlayable] = useState(false);
    const [isEvaluated, setIsEvaluated] = useState(false)
    const [isSubmit, setIsSubmit] = useState(false)
    const [stream, setStream] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const [score, setScore] = useState(0);

    let audioChunks = []
    let apiMainPathSTS = 'http://127.0.0.1:3001';

    const mediaStreamConstraints = {
        audio: {
            channelCount: 1,
            sampleRate: 48000,
        },
    };

    useEffect(() => {

        resetRecorder();

    }, [shouldReset]);

    const resetRecorder = () => {
        setIsRecording(false);
        setIsPlayable(false)
        setIsSubmit(false)
        setIsEvaluated(false)
        setAudioUrl(null)
        setStream(null)
        setErrorMessage("")
        setScore(0)
        audioChunks = []
    };

    const startMediaDevice = async () => {
        try {

            const newStream = await navigator.mediaDevices.getUserMedia(mediaStreamConstraints);
            setStream(newStream);

            const mediaRecorder = new MediaRecorder(newStream);

            mediaRecorder.ondataavailable = (event) => {
                // 상태 업데이트 대신 로컬 변수에 데이터 저장
                audioChunks.push(event.data)
            };

            mediaRecorder.onstop = async () => {

                setIsSubmit(true)

                const blob = new Blob(audioChunks, { type: "audio/ogg;" });
                const url = URL.createObjectURL(blob);

                let audioBase64 = await convertBlobToBase64(blob);

                let minimumAllowedLength = 6;

                if (audioBase64.length < minimumAllowedLength) {
                    setErrorMessage("너무 짧습니다. 다시 녹음해주세요.")
                    return
                }

                setAudioUrl(url);
                getAudio(url);
                setIsPlayable(true); // 녹음이 끝난 후 재생 가능 상태로 전환

                // const response = await fetch(apiMainPathSTS + '/GetAccuracyFromRecordedAudio', {
                //     method: "post",
                //     body: JSON.stringify({ "title": sample, "base64Audio": audioBase64, "language": "en" }),
                //     // headers: { "X-Api-Key": STScoreAPIKey }

                // })


                // if (!response.ok) {
                //     alert('fail')
                //     throw new Error("정확도 불러오기 실패")
                // }

                // const result = await response.json()

                // const score = parseFloat(result.pronunciation_accuracy)

                const score = 80;

                if (score >= passThreshold)
                    onPassUpdate(index, true)

                setIsEvaluated(true)
                setIsSubmit(false)
                setScore(score)
                onScoreUpdate(score)
            };



            return mediaRecorder;
        } catch (err) {
            setErrorMessage(err.message || "An error occurred while accessing the microphone.");
        }
    };

    const toggleRecording = async () => {
        if (!stream) {
            const mediaRecorder = await startMediaDevice();
            if (!mediaRecorder) return;
        }

        if (isRecording) {
            stream.getTracks().forEach((track) => track.stop());
            setIsRecording(false);
        } else {
            setIsEvaluated(false)

            audioChunks = []
            setIsRecording(true);
            const mediaRecorder = await startMediaDevice();
            mediaRecorder.start();
        }
    };

    const replayAudio = (e) => {
        e.preventDefault();

        try {
            if (audioUrl) {
                const audio = new Audio(audioUrl);
                audio.play()
            } else {
                alert("No audio to play. Please record something first.");
            }
        } catch (e) {
            setErrorMessage(e)
        }
    };


    return (
        <div className={styles.voiceRecord}>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    toggleRecording();
                }}
                disabled={isSubmit && !isEvaluated}
                className={styles.recordButton}
            >
                <img src="/assets/images/icons/녹음하기.svg" alt="Mic Icon" style={{ userSelect: "none" }} draggable="false" />
            </button>
            <p className={styles.recordInstruction}>{isRecording ? "녹음중지" : "녹음하기"}</p>
            <p className={styles.recordSubInstruction}>{isRecording ? "녹음이 끝나면 마이크를 눌러" : "마이크를 누르고 발음하세요"}</p>

            {isPlayable && (
                <div>
                    {/* <button onClick={replayAudio}>녹음 재생</button> */}
                    {/* <div>
                        <audio src={audioUrl} controls />
                    </div> */}
                </div>
            )}

            <div>{errorMessage}</div>

        </div>
    )
}

const convertBlobToBase64 = async (blob) => {
    return await blobToBase64(blob);
}

const blobToBase64 = blob => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

function VocabCorrectPopup() {
    return (
        <div className={styles.popupContainer}>
            <div className={styles.card}>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>정답입니다~</h1>
                    </div>

                    <div className={styles.checkmarkContainer}>
                        <div className={styles.checkmarkCircle}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
                                <path d="M25.4658 40.4L48.0658 17.8C48.5992 17.2667 49.2214 17 49.9325 17C50.6436 17 51.2658 17.2667 51.7992 17.8C52.3325 18.3333 52.5992 18.9671 52.5992 19.7013C52.5992 20.4356 52.3325 21.0684 51.7992 21.6L27.3325 46.1333C26.7992 46.6667 26.177 46.9333 25.4658 46.9333C24.7547 46.9333 24.1325 46.6667 23.5992 46.1333L12.1325 34.6667C11.5992 34.1333 11.3432 33.5004 11.3645 32.768C11.3858 32.0356 11.6641 31.4018 12.1992 30.8667C12.7343 30.3316 13.3681 30.0649 14.1005 30.0667C14.833 30.0684 15.4658 30.3351 15.9992 30.8667L25.4658 40.4Z" fill="#0084D0" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function VocabNoChancePopup() {
    return (
        <div className={styles.popupContainer}>
            <div className={styles.card}>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>모든 기회 소진~</h1>
                        <h1 className={styles.title}>공부 하고 다시 오셈!</h1>
                    </div>

                    <div className={styles.checkmarkContainer}>
                        <div className={styles.checkmarkCircle}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
                                <path d="M25.4658 40.4L48.0658 17.8C48.5992 17.2667 49.2214 17 49.9325 17C50.6436 17 51.2658 17.2667 51.7992 17.8C52.3325 18.3333 52.5992 18.9671 52.5992 19.7013C52.5992 20.4356 52.3325 21.0684 51.7992 21.6L27.3325 46.1333C26.7992 46.6667 26.177 46.9333 25.4658 46.9333C24.7547 46.9333 24.1325 46.6667 23.5992 46.1333L12.1325 34.6667C11.5992 34.1333 11.3432 33.5004 11.3645 32.768C11.3858 32.0356 11.6641 31.4018 12.1992 30.8667C12.7343 30.3316 13.3681 30.0649 14.1005 30.0667C14.833 30.0684 15.4658 30.3351 15.9992 30.8667L25.4658 40.4Z" fill="#0084D0" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function NextStagePopup(handlesubmit) {
    return (
        <div className={styles.popupContainer}>
            <div className={styles.card}>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Vocabulary 테스트 완료</h1>
                        <div className={styles.stats}>
                            <div className={styles.statText}>맞은 문제 수: 15개</div>
                            <div className={styles.wrongText}>틀린 문제 수: 15개</div>
                        </div>
                    </div>

                    <div className={styles.checkmarkContainer}>
                        <div className={styles.checkmarkCircle}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
                                <path d="M25.4658 40.4L48.0658 17.8C48.5992 17.2667 49.2214 17 49.9325 17C50.6436 17 51.2658 17.2667 51.7992 17.8C52.3325 18.3333 52.5992 18.9671 52.5992 19.7013C52.5992 20.4356 52.3325 21.0684 51.7992 21.6L27.3325 46.1333C26.7992 46.6667 26.177 46.9333 25.4658 46.9333C24.7547 46.9333 24.1325 46.6667 23.5992 46.1333L12.1325 34.6667C11.5992 34.1333 11.3432 33.5004 11.3645 32.768C11.3858 32.0356 11.6641 31.4018 12.1992 30.8667C12.7343 30.3316 13.3681 30.0649 14.1005 30.0667C14.833 30.0684 15.4658 30.3351 15.9992 30.8667L25.4658 40.4Z" fill="#0084D0" />
                            </svg>
                        </div>
                    </div>

                    <button className={styles.button} onClick={handlesubmit}>
                        다음 스테이지로
                    </button>
                </div>
            </div>
        </div>
    )
}