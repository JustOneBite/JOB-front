'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"; // useRouter 가져오기

export default function TeacherCheckSubmit() {

    const [writingText, setWritingText] = useState('')
    const router = useRouter(); // useRouter 초기화

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
                })

                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }

                const temp_result = await response.json();
                const result = temp_result.result

                // 응답에서 받은 writingInfo + content 저장
                setWritingInfo({ title: result.theme, wordLimit: result.wordLimit, content: savedContent})
                alert(writingInfo.content) // test
                setWritingText(savedContent)
                setSubmitCount(result.submitCnt)

                //새로고침 시 grammar test가 1번 더 실행되는 것을 방지 
                if (!hasRun) {

                    setHasRun(true); // 실행 여부를 기록

                    console.log("문법 검사")

                    let count = submitCount + 1

                    setSubmitCount(count)
                    
                    //처음 페이지 라우트 되었을 때 grammar test 실행
                    const grammarResponse = await fetch("http://localhost:8080/validator/writing", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            content: savedContent,
                        }),
                        credentials: "include",
                    });
        
                    if (!grammarResponse.ok) {
                        throw new Error("Failed to check grammar.");
                    }
        
                    const checkedGrammarResult = await grammarResponse.json();
        
                    // 문법 검사 결과 업데이트
                    setGrammerResult(checkedGrammarResult.grammarIssues);

                }



            } catch (err) {
                setError(err.message); // 오류 발생 시 상태에 오류 메시지 저장
            } finally {
                setLoading(false); // 로딩 상태 변경
            }
        };

        fetchData();
    }, []);

    const handleSubmit = () =>{
        router.push('./finalSubmit')
    }

    const handleChange = (e) => {
        writingText = e.target.value
        setWritingText(writingText)
    }

    return (
        <div>
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
                <button type="submit" disabled={countWords(writingText) === 0}>최종 제출</button> 
            </form>
        </div>
    )
}