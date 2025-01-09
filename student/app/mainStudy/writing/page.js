'use client'

import {mainPage, getWritingData, updateStudentContent, incSubmitCnt, readStudentLesson, writingValidator} from "../../util/writingUtil"

import StartPage from "./stage0/startPage"
import ReferencePage from "./stage1/referencePage"
import FirstWritingPage from "./stage2/firstWritingPage"
import GrammarCheckPage from "./stage3/grammarCheckPage"
import TeacherFeedbackPage from "./stage4/teacherFeedbackPage"
import FinalSubmitPage from "./stage5/finalSubmitPage"
import { useEffect, useState } from "react"

export default function WritingController() {

    const [stageLevel, setStageLevel] = useState(0) // 0 - writingMainPage 1 - referencePage 2 - firstWriting 3 - grammarCheck 4 - teacherFeedback 5 - finalSubmit

    const [studentContent, setStudentContent] = useState('')
    const [teacherFeedback, setTeacherFeedback] = useState([])
    const [submitCnt, setSubmitCnt] = useState(0)
    const [theme, setTheme] = useState('')
    const [wordLimit, setWordLimit] = useState('')
    const [reference, setReference] = useState([])
    const [allocatedDate, setAllocatedDate] = useState(null)

    const [stageOneData,setStageOneData] = useState([])
    const [stageTwoData,setStageTwoData] = useState([])
    const [stageThreeData,setStageThreeData] = useState([])
    const [stageFourData,setStageFourData] = useState([])
    const [stageFiveData,setStageFiveData] = useState([])


    const [currentStageLevel, setCurrentStageLevel] = useState(0)
    const [ComponentToRender, setComponentToRender] = useState(null)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // studentContent, teacherFeedback, submitCnt // theme, wordLimit, reference

    // 학생에게 배정된 curriculum 정보 요청
    useEffect(() => {
        // 비동기 함수로 API 호출
        const fetchData = async () => {
            try {

                const studentLessonId = "677b977fe5c781a4dec77d34"
                const resultStudentData = await readStudentLesson(studentLessonId)

                setStudentContent(resultStudentData.studentData.content)
                setTeacherFeedback(resultStudentData.studentData.teacherFeedback)
                setSubmitCnt(resultStudentData.studentData.submitCnt)
                setAllocatedDate(resultStudentData.allocatedDate)
                

                const writingDataId = "6776c6c51dc045f5cf7530cb"
                const resultWritingData = await getWritingData({id:writingDataId})

                setTheme(resultWritingData.theme)
                setWordLimit(resultWritingData.wordLimit)
                setReference(resultWritingData.reference)

            } catch (err) {
                setError(err.message); // 오류 발생 시 상태에 오류 메시지 저장
            } finally {
                setLoading(false); // 로딩 상태 변경
            }
        };

        fetchData();
    }, []);

    useEffect(() => {

        if(currentStageLevel === 0){
            setComponentToRender(()=>StartPage)
        }else if(currentStageLevel === 1){
            setComponentToRender(()=>ReferencePage)
        }else if(currentStageLevel === 2){
            setComponentToRender(()=>FirstWritingPage)
        }else if(currentStageLevel === 3){
            setComponentToRender(()=>GrammarCheckPage) 
        }else if(currentStageLevel === 4){
            setComponentToRender(()=>TeacherFeedbackPage)
        }else if(currentStageLevel === 5){
            setComponentToRender(()=>FinalSubmitPage)     
        }

    }, [currentStageLevel])

    const handleCurrentStage = (updateData) => {
        setStudentContent(updateData.content)
        setSubmitCnt(updateData+1)
        setCurrentStageLevel(currentStageLevel + 1)
    };

    const handletSendingData = () => {
        const stageData = [stageOneData, stageTwoData, stageTwoData, stageThreeData, stageFourData, stageFiveData];
        return stageData[currentStageLevel] || null; // 안전한 반환
    }

    // type, lesson num, date는 이전 페이지에서 불러옴.
    return (
        <div>
        {
                ComponentToRender ? (
                    <ComponentToRender
                    data = { handletSendingData() }
                    onTestComplete={(updateData) => handleCurrentStage(updateData)}
                    />
                ) : (
                    <div>Loading...</div> // 로딩 상태 표시
                )
        }

        <div>
            {studentContent}, {teacherFeedback},{submitCnt},{theme},{wordLimit},{reference}
        </div>
        </div>
    )
}