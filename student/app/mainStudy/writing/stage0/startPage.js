'use Client'

import { useEffect, useState } from "react"
import { getCurriculumName, getLessonNum } from "../../../util/writingUtil"

export default function StartPage({data, onComplete}){
    const [errorMessage, setErrorMessage] = useState("")
    const [curriculumName, setCurriculumName] = useState("")
    const [lessonNumber, setLessonNumber] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {

                const name = await getCurriculumName(data.curriculumId)
                setCurriculumName(name)
                
                const num = await getLessonNum(data.lessonId)
                setLessonNumber(num)

            } catch (err) {
                setErrorMessage(err.message); // 오류 발생 시 상태에 오류 메시지 저장
            }
        }

        fetchData()
    },[])

    const handleSubmit = (e) => {
        const updateData = null
        e.preventDefault()
        onComplete(updateData)
    }

    return (
        <div>
            <h2>커리 이름 : {curriculumName}</h2>
            <h2>레슨 번호 : {lessonNumber}</h2>
            <h2>날짜 : {data.allocatedDate}</h2>
            <div>{errorMessage}</div>

            <button onClick={handleSubmit}>start</button>
        </div>
    )
}