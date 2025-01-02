'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"; // useRouter 가져오기

export default function Writing() {

    const [writingText, setWritingText] = useState('')
    const [writingInfo, setWritingInfo] = useState({ title: '', wordLimit: 0, content : '' })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [submitCount, setSubmitCount] = useState(0)
    const [grammerResult, setGrammerResult] = useState(null)
    const router = useRouter(); // useRouter 초기화

    const btnTitleArr = ['1차 문법 검사', '2차 문법 검사', '선생님 검사', '최종 제출']
    const [btnTitle, setBtnTitle] = useState(btnTitleArr[0])

    useEffect(() => {
        // 비동기 함수로 API 호출
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/writingData/read', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',  // Content-Type을 JSON으로 설정
                    },
                    body: JSON.stringify({
                        curriculumId: "64fd8570b1e2a4e334c8b33d",
                        lessonId: "64fd8570b1e2a4e334c8b33e"
                    }),
                    credentials: 'include'  // 쿠키를 포함하려면 이 설정 추가
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const temp_result = await response.json();
                const result = temp_result.result

                setWritingInfo({ title: result.theme, wordLimit: result.wordLimit, content: result.content }); // 응답에서 받은 writingInfo 저장
                setWritingText(result.content)
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
        setWritingText(inputText);
    };

    const handleClick = async () => {
        try {

            const response = await fetch('http://localhost:8080/writingData/update', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',  // Content-Type을 JSON으로 설정
                },
                body: JSON.stringify({
                    theme: writingInfo.title,
                    studentContent: writingText,
                }),
                credentials: 'include'  // 쿠키를 포함하려면 이 설정 추가
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            let temp_result = await response.json();
            console.log('update 성공이다제!')
            const result = temp_result.result

            // console.log("result : ", result)
            // console.log("result : ", result.data)

            setWritingInfo({ title: result.theme, wordLimit: result.wordLimit, content: result.content }); // 응답에서 받은 writingInfo 저장
            setSubmitCount(result.submitCnt) 

        } catch (err) {
            setError(err.message); // 오류 발생 시 상태에 오류 메시지 저장
        }
    };

    const grammerCheck = async () => {
        try {

            const grammarResponse = await fetch("http://localhost:8080/validator/writing", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: writingText,
                }),
                credentials: "include",
            });

            if (!grammarResponse.ok) {
                throw new Error("Failed to check grammar.");
            }

            const checkedGrammarResult = await grammarResponse.json();

            // 문법 검사 결과 업데이트
            setGrammerResult(checkedGrammarResult.grammarIssues);
        } catch (err) {
            setError(err.message)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault() //새로 고침 방지지

        await grammerCheck() // 문법 체크 진행행

        await handleClick()

        if(submitCount === 2){
            router.push('./teacherCheckSubmit')
        }
    };

    const highlightText = (text, issues) => {
        if (issues === null || issues.length === 0) {
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
        highlightedParts.push(text.slice(lastIndex));
    
        return <>{highlightedParts}</>; // 모든 부분을 React 요소로 반환
    };


    return (
        <div className="p-20">
            <h4>{writingInfo.title}</h4>
            <form onSubmit={handleSubmit}>
                <textarea
                    name="content"
                    value={writingText}
                    onChange={handleChange}
                    maxLength={writingInfo.wordLimit}
                    placeholder="글을 작성하세요"
                />
                <p>남은 글자수 {writingInfo.wordLimit - countWords(writingText)}</p>
                <button type="submit" disabled={countWords(writingText) === 0}>{btnTitle}</button>
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
            <div
                style={{ border: '1px solid #ccc', padding: '10px', minHeight: '100px' }}
            >
                {highlightText(writingInfo.content, grammerResult)}
            </div>
        </div>
    )
}