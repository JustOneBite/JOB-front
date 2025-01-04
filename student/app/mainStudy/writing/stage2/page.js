'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { getWritingData,updateStudentContent, incSubmitCnt } from "./util"

export default function WritingStart() {

    const router = useRouter(); // useRouter 초기화
    const [writingInfo, setWritingInfo] = useState({ theme: '', wordLimit: 0})
    const [content, setContent] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        // 비동기 함수로 API 호출
        const fetchData = async () => {
            try {
                
                const requestBody = {
                    curriculumId: "64fd8570b1e2a4e334c8b33d",
                    lessonId: "64fd8570b1e2a4e334c8b33e"
                }

                const result = await getWritingData(requestBody)
                
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

    const handleSubmit = async (content) => {
        //content 저장 하는 코드 추가해야함 및 학습 상태 업데이트
        try{
            await updateStudentContent("67794cc250b5dfb6b7122316",content)

            await incSubmitCnt("67794cc250b5dfb6b7122316")

            router.push("./grammarCheckSubmit");
        }
        catch (err) {
            setErrorMessage(err.message); // 오류 발생 시 상태에 오류 메시지 저장
        }
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

            <div>{ errorMessage }</div>
        </div>
    )
}
