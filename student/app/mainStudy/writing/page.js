'use client'
import { useEffect, useState } from "react"

export default function Writing() {

    const [writing, setWriting] = useState('')
    const [writingInfo, setWritingInfo] = useState({ title: '', wordLimit: 0 })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [submitCount, setSubmitCount] = useState(0)
    const [grammerResult, setGrammerResult] = useState(null)

    const btnTitleArr = ['1차 문법 검사', '2차 선생님 검사', '최종 제출']
    const [btnTitle, setBtnTitle] = useState(btnTitleArr[0])

    useEffect(() => {
        // 비동기 함수로 API 호출
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/mainStudy/readWritingData', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',  // Content-Type을 JSON으로 설정
                    },
                    body: JSON.stringify({
                        theme: "a"
                    }),
                    credentials: 'include'  // 쿠키를 포함하려면 이 설정 추가
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result1 = await response.json();
                const result = result1.writingData

                setWritingInfo({ title: result.theme, wordLimit: result.wordLimit }); // 응답에서 받은 writingInfo 저장장
                setWriting(result.studentContent)
                setSubmitCount(result.submitCnt)
            } catch (err) {
                setError(err.message); // 오류 발생 시 상태에 오류 메시지 저장
            } finally {
                setLoading(false); // 로딩 상태 변경
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (submitCount < btnTitleArr.length) {
            setBtnTitle(btnTitleArr[submitCount]);
        }
    }, [submitCount]); // submitCount가 변경될 때 실행

    if (loading) return <div>Loading...</div>; // 로딩 중일 때 
    if (error) return <div>Error: {error}</div>; // 오류 발생 시

    const countWords = (text) => {
        return text.length;
    };

    const handleChange = (e) => {
        const inputText = e.target.value;
        setWriting(inputText);
    };

    const handleClick = async () => {
        try {

            const response = await fetch('http://localhost:8080/mainStudy/saveWritingData', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',  // Content-Type을 JSON으로 설정
                },
                body: JSON.stringify({
                    theme: writingInfo.title,
                    studentContent: writing,
                }),
                credentials: 'include'  // 쿠키를 포함하려면 이 설정 추가
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            alert('저장 성공이다제!')

            setWritingInfo({ title: result.theme, wordLimit: result.wordLimit, submitCount: result.submitCnt }); // 응답에서 받은 writingInfo 저장장

        } catch (err) {
            setError(err.message); // 오류 발생 시 상태에 오류 메시지 저장
        }
    };

    const grammerCheck = async () => {
        try {
            
            const grammarResponse = await fetch("http://localhost:8080/mainStudy/grammerCheck", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: writing,
                }),
                credentials: "include",
            });

            if (!grammarResponse.ok) {
                throw new Error("Failed to check grammar.");
            }

            const grammarResult = await grammarResponse.json();

            // 문법 검사 결과 업데이트
            setGrammerResult(grammarResult.grammarIssues);
        } catch (err) {
            setError(err.message)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 동작 방지
        await grammerCheck(); // 문법 검사 수행
        await handleClick(); // 저장 기능 수행

    };

    return (
        <div className="p-20">
            <h4>{writingInfo.title}</h4>
            <form onSubmit={handleSubmit}>
                <textarea
                    name="content"
                    value={writing}
                    onChange={handleChange}
                    maxLength={writingInfo.wordLimit}
                    placeholder="글을 작성하세요"
                />
                <p>남은 글자수 {writingInfo.wordLimit - countWords(writing)}</p>
                <button type="submit" disabled={countWords(writing) === 0}>{btnTitle}</button>
            </form>
            {grammerResult && (
                <div>
                    <h2>Grammar Issues:</h2>
                    {grammerResult.map((issue, index) => (
                        <div key={index}>
                            <p>{issue.message}</p>
                            <p>Context: {issue.context.text}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}