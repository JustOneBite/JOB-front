'use client'

import styles from './page.module.css';
import { ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState, useRef } from 'react'

export default function listening() {
    const [listeningData, setListeningData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [textInput, setTextInput] = useState('')
    const audioRef = useRef(null) // 오디오 태그에 접근하기 위한 참조 생성
    let isCorrect = false

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/mainStudy/readListeningData',
                    {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            title: "youtube"
                        }),
                        credentials: 'include'
                    });

                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }

                const result = await response.json()
                setListeningData(result.existingListeningData)

            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        };

        fetchData()
    }, [])

    useEffect(() => {
        if (listeningData && audioRef.current) {
            const [minutes, seconds] = listeningData.time[0].split(':').map(Number)
            const startTime = minutes * 60 + seconds
            audioRef.current.currentTime = startTime
        }
    }, [listeningData])

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const renderTextWithUnderline = (wordArr, offset) => {

        return wordArr.map((word, index) => {

            if (word === wordArr[offset[0] - 1]) {
                // offset에서 주어진 단어인 경우 빨간 밑줄과 텍스트 입력 필드를 제공
                return (
                    <span key={index} style={{ borderBottom: '2px solid red', display: 'inline-block' }}>
                        <input
                            type="text"
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder="단어 입력"
                            maxLength='100'
                            style={{ width: '100px', border: 'none', outline: 'none' }}
                        />
                    </span>
                )

            } else {
                // 그 이외 단어들은 검은색 밑줄로 표시
                return (
                    <span key={index} style={{ borderBottom: '2px solid black', margin: '10px' }}>
                        {word}
                    </span>
                );
            }
        })
    }

    const checkListeningAnswer = (answer) => {
        if (answer === textInput) {
            isCorrect = true;
            alert("정답입니다!")
        }
        else {
            alert("정답이 아닙니다!")
        }
    }

    const turnToNextPage = () => {
        if (isCorrect) {
            alert("다음 페이지!")
        }
        else {
            alert("흠.. 정답을 맞추고 넘어가세요")
        }
    }

    const getProgressPercentage = () => {
        return (1 / 30) * 100
    }

    return (
        <div>

            <div className={styles.listeningHeader}>
                <div>
                    <h1>Listening</h1>
                    <p>Lesson 3</p>
                </div>

                <div className={styles.progressBar}>
                    <ProgressBar now={getProgressPercentage} label='1/30' />
                </div>
                <p>1/30</p>
            </div>

            <h2>다음을 듣고 문장을 작성하세요.</h2>
            <p>시작 시간 : {listeningData.time[0]}  ~  끝나는 시간 : {listeningData.time[1]}</p>

            <div className={styles.listeningProblemBox}>
                <audio src={listeningData.url} controls ref={audioRef}></audio>
                <form
                onSubmit={(e) => {
                    e.preventDefault()
                    checkListeningAnswer(listeningData.wordArr[listeningData.offset[0] - 1])
                }
                }>
                <div style={{ marginTop: '20px' }}>
                    {renderTextWithUnderline(listeningData.wordArr, listeningData.offset)}
                </div>
                <button type='submit'>제출</button>
            </form>
            </div>

            <button type='button' onClick={turnToNextPage} disabled={isCorrect}>다음 문제</button>

        </div>
    );
}


//branch test 용 수정