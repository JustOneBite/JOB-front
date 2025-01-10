'use client'

import { writingValidator } from "../../../util/writingUtil"
import { useEffect, useState } from "react"

export default function GrammerCheck({data, onComplete}) {

    const [writingText, setWritingText] = useState('') //학생이 작성하는 writing text 저장 (실시간 변경 가능능).
    const [writingContent, setWritingContent] = useState('') //DB에 저장된 학생 writing content
    const [submitCount, setSubmitCount] = useState(0)

    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')
    const [grammarResult, setGrammarResult] = useState([])

    useEffect(() => {
        // 비동기 함수로 API 호출
        const fetchData = async () => {
            try {
                setGrammarResult(data.grammarResult)
                setWritingContent(data.studentContent)
                setWritingText(data.studentContent)
                setSubmitCount(data.submitCnt)
            } catch (err) {
                setErrorMessage(err.message); // 오류 발생 시 상태에 오류 메시지 저장
            } finally {
                setLoading(false); // 로딩 상태 변경
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>; // 로딩 중일 때 
    if (errorMessage) return <div>Error: {errorMessage}</div>; // 오류 발생 시

    const countWords = (text) => {
        return text.length
    };

    const handleChange = (e) => {
        const inputText = e.target.value;
        setWritingText(inputText);
    };

    const handleClick = async () => {
        try {

            setWritingContent(writingText); // 응답에서 받은 writingInfo 저장
            setWritingText(writingText)
            setSubmitCount(submitCount + 1)

        } catch (err) {
            errorMessage(err.message); // 오류 발생 시 상태에 오류 메시지 저장
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault() //새로 고침 방지

        await handleClick() // content 수정 내용 저장

        const returnData = {
            content: writingText,
        }

        console.log(returnData, "return Data")

        return onComplete(returnData)
    };

    const highlightText = (text, issues) => {
        if (issues === null || issues[0].context.text === "ALL PASS") {
            return text // 문법 오류가 없으면 원본 텍스트 반환
        }
    
        let highlightedParts = [];
        let lastIndex = 0; // 마지막 인덱스 추적
    
        // 문법 검사 결과를 순회하여 해당 단어에 스타일을 적용
        issues.forEach((issue, index) => {
            const regex = new RegExp(`(${issue.context.text})`, "g"); // 일치하는 텍스트 찾기
            const matchIndex = text.indexOf(issue.context.text, lastIndex); // 현재 인덱스에서 찾기
    
            // 현재 오류가 발견된 인덱스까지의 텍스트를 추가
            if (matchIndex > -1) {
                highlightedParts.push(text.slice(lastIndex, matchIndex)); // 이전 텍스트 추가
                highlightedParts.push(<span key={`number-${index}`} style={{ color: "blue" }}> [{index + 1}] </span>); // 오류 번호 추가
                highlightedParts.push(
                    <span key={`error-${index}`} style={{ textDecoration: "underline", color: "red" }}>
                        {issue.context.text}
                    </span>
                );
                lastIndex = matchIndex + issue.context.text.length; // 마지막 인덱스 업데이트
            }
        });
    
        // 마지막 부분 추가
        highlightedParts.push(text.slice(lastIndex))
    
        return <>{highlightedParts}</>; // 모든 부분을 React 요소로 반환
    };


    return (
        <div className="p-20">
            <h4>{data.writingInfo.theme}</h4>
            <form onSubmit={handleSubmit}>
                <textarea
                    name="content"
                    value={writingText}
                    onChange={handleChange}
                    maxLength={data.writingInfo.wordLimit}
                    placeholder="글을 작성하세요"
                />
                <p>남은 글자수 {data.writingInfo.wordLimit - countWords(writingText)}</p>
                <button type="submit" disabled={countWords(writingText) === 0}>선생님 검사</button>
            </form>
            {grammarResult && (
                <div>
                    <h2>Grammar Issues:</h2>
                    {grammarResult.map((issue, index) => (
                        <div key={index}>
                            <p>{issue.message}</p>
                            <p>Context: {issue.context.text}</p>
                        </div>
                    ))}
                </div>
            )}
            <div
                style={{ border: '1px solid #ccc', padding: '10px', minHeight: '100px' }}
            >
                {highlightText(writingContent, grammarResult)}
            </div>

            <div>{errorMessage}</div>
        </div>
    )
}