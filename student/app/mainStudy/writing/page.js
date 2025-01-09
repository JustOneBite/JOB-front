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
    const [lessonId, setLessonId] = useState(null)
    const [curriculumId, setCurriculumId] = useState(null)

    const [stageData,setStageData] = useState(null)
    const [isStageDataReady, setIsStageDataReady] = useState(true)
    const [isCurrentStageReady, setIsCurrentStageReady] = useState(true)
    const [isInitialUpdate,setIsInitialUpdate] = useState(false)
    


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
                setLessonId(resultStudentData.lessonId)
                setCurriculumId(resultStudentData.curriculumId)

                const writingDataId = "6776c6c51dc045f5cf7530cb"
                const resultWritingData = await getWritingData({id:writingDataId})

                setTheme(resultWritingData.theme)
                setWordLimit(resultWritingData.wordLimit)
                setReference(resultWritingData.references);

            } catch (err) {
                setError(err.message); // 오류 발생 시 상태에 오류 메시지 저장
            } finally {
                setIsInitialUpdate(true)
                setLoading(false); // 로딩 상태 변경
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        handleSettingData()

        if(isCurrentStageReady && isStageDataReady && isInitialUpdate)
        {
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
            
            setIsCurrentStageReady(false)
            setIsStageDataReady(false)
        }
        

    }, [currentStageLevel, isStageDataReady, isCurrentStageReady,isInitialUpdate])

    const handleCurrentStage = (updateData) => {

        // if(currentStageLevel === 1){
        // 추가하기
        // }
        
        setCurrentStageLevel(currentStageLevel + 1)
        setIsCurrentStageReady(true)
    };

    const handleSettingData = () => {

        let updateData = null

        if (currentStageLevel === 0) { // 비교 연산자를 엄격하게 사용
            
            updateData = {
                curriculumId: curriculumId,
                lessonId: lessonId,
                allocatedDate: allocatedDate,
            };
    
        }
        else if(currentStageLevel === 1) {
            console.log(reference)
            updateData = {
                reference : reference
            };
        }

        setStageData(updateData);

        setIsStageDataReady(true)
    };

    // type, lesson num, date는 이전 페이지에서 불러옴.
    return (
        <div>
        {
                ComponentToRender ? (
                    <ComponentToRender
                    data = { stageData }
                    onComplete={(updateData) => handleCurrentStage(updateData)}
                    />
                ) : (
                    <div>Loading...</div> // 로딩 상태 표시
                )
        }

        {/* <div>
            {studentContent}, {teacherFeedback},{allocatedDate},{submitCnt},{theme},{wordLimit},{reference}
        </div> */}
        </div>
    )
}