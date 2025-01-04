'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"; // useRouter 가져오기

export default function TeacherCheckSubmit() {

    const [writingText, setWritingText] = useState('') //학생이 작성하는 writing text 저장 (실시간 변경 가능능).
    const [writingInfo, setWritingInfo] = useState({ title: '', wordLimit: 0 })
    const [writingContent, setWritingContent] = useState('') //DB에 저장된 학생 writing content
    const [submitCount, setSubmitCount] = useState(0)

    const router = useRouter(); // useRouter 초기화

    useEffect(() => {
        // 비동기 함수로 API 호출
        const fetchData = async () => {
            try {

                const writingDataResponse = await fetch('http://localhost:8080/writingData/read', {
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

                if (!writingDataResponse.ok) {
                    throw new Error('Network response was not ok')
                }

                const tempWritingDataResult = await writingDataResponse.json();
                const writingDataResult = tempWritingDataResult.result

                // 응답에서 받은 writingInfo 저장
                setWritingInfo({ title: writingDataResult.theme, wordLimit: writingDataResult.wordLimit})

                // 학생이 작성한 writing content 불러오기
                const studentLessonResponse = await fetch('http://localhost:8080/studentLesson/read', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',  // Content-Type을 JSON으로 설정
                    },
                    body: JSON.stringify({
                            searchType: 1,
                            id: "67794cc250b5dfb6b7122316",
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
        router.push('./finalSubmit')
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