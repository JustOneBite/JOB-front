'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";

export default function WritingStart() {

    const router = useRouter(); // useRouter 초기화
    const [writingInfo, setWritingInfo] = useState({ theme: '', wordLimit: 0})
    const [content, setContent] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

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
                        curriculumId: "64fd8570b1e2a4e334c8b34d",
                        lessonId: "64fd8570b1e2a4e334c8b34e"
                    }),
                    credentials: 'include'  // 쿠키를 포함하려면 이 설정 추가
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const temp_result = await response.json();
                const result = temp_result.result

                
                
                setWritingInfo({theme : result.theme, wordLimit : result.wordLimit})
            } catch (err) {
                setErrorMessage(err.message); // 오류 발생 시 상태에 오류 메시지 저장
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const inputText = e.target.value;
        setContent(inputText);
    }

    const countWords = (text) => {
        return text.length
    }

    const handleSubmit = (content) => {
        //content 저장 하는 코드 추가해야함 및 학습 상태 업데이트
        localStorage.setItem('content', JSON.stringify(content));
        router.push("./grammarCheckSubmit");
    }

    return (
        <div>
            <div className="p-20">
                <h4>{writingInfo.theme}</h4>
                
                <textarea
                    name="content"
                    value={content}
                    onChange={handleChange}
                    maxLength={writingInfo.wordLimit}
                    placeholder="글을 작성하세요"
                />
                <p>남은 글자수 {writingInfo.wordLimit - countWords(content)}</p>
                <button onClick={() => handleSubmit(content)} disabled={countWords(content) === 0}> 1차 문법 검사 </button>
                
            </div>
        </div>
    )
}
