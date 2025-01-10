'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"; // useRouter 가져오기

export default function TeacherCheckSubmit({data, onComplete}) {

    const [writingText, setWritingText] = useState('') //학생이 작성하는 writing text 저장 (실시간 변경 가능능).
    const [writingContent, setWritingContent] = useState('') //DB에 저장된 학생 writing content
    const [submitCount, setSubmitCount] = useState(0)
    const [Error, setError] = useState('')

    const router = useRouter(); // useRouter 초기화

    useEffect(() => {
        // 비동기 함수로 API 호출
        const fetchData = async () => {
            try {

                // 학생이 작성한 writing content 불러오기
                const studentLessonResponse = await fetch('http://localhost:8080/studentLesson/read', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',  // Content-Type을 JSON으로 설정
                    },
                    body: JSON.stringify({
                            searchType: 1,
                            id: data.studentLessonId,
                    }),
                    credentials: 'include'  // 쿠키를 포함하려면 이 설정 추가
                })

                const tempStudentLessonResult = await studentLessonResponse.json()
                const studentLessonResult = tempStudentLessonResult.result.studentData
                
                setWritingContent(studentLessonResult.content)
                setWritingText(studentLessonResult.content)
                setSubmitCount(studentLessonResult.submitCnt)

                // 학생이 작성한 content에 대한 선생님의 feedback을 불러와야 됨.

            } catch (err) {
                setError(err.message); // 오류 발생 시 상태에 오류 메시지 저장
            }
        }

        fetchData()

    }, [])

    const handleSubmit = () =>{
        const returnData = {
            content: writingText,
            submitCnt: submitCount
        }
        return onComplete   (returnData)
    }

    const handleChange = (e) => {
        const inputText = e.target.value;
        setWritingText(inputText);
    };

    const countWords = (text) => {
        return text.length;
    };

    return (
        <div>
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
                <button type="submit" disabled={countWords(writingText) === 0}>최종 제출</button> 
            </form>
        </div>
    )
}