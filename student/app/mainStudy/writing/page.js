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
    const [validateResult, setValidateResult] = useState([])

    const [stageData,setStageData] = useState(null)
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

        if(isInitialUpdate)
        {

            console.log(stageData, currentStageLevel,"11111")


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
        }
        

    }, [currentStageLevel, isInitialUpdate])

    const checkGrammar = async (contentData) => {
        const result = await writingValidator(contentData)
        setValidateResult(result)
    }

    const handleCurrentStage = async (updateData) => {

        const updatingData = async (updateData) => {
            if(currentStageLevel === 2){
                setStudentContent(updateData.content)
                setSubmitCnt(submitCnt + 1)

                await checkGrammar(updateData.content)
            }
            else if(currentStageLevel === 3 || currentStageLevel === 4){
                setStudentContent(updateData.content)
                setSubmitCnt(submitCnt + 1)
            }
            else if(currentStageLevel === 5){
                setStudentContent(updateData.studentContent)
                setSubmitCnt(submitCnt + 1)
            }

            setCurrentStageLevel(currentStageLevel + 1)
        }

        await updatingData(updateData)
        
    };

    const handleSettingData = async () => {

        const setUpdatingData = async () => {
            let updateData = null

            if (currentStageLevel === 0) { // 비교 연산자를 엄격하게 사용
                updateData = {
                    curriculumId: curriculumId,
                    lessonId: lessonId,
                    allocatedDate: allocatedDate,
                };
            }
            else if(currentStageLevel === 1) {
                updateData = {
                    reference : reference
                };
            }
            else if(currentStageLevel === 2) {
                updateData = {
                    content :  studentContent,
                    wordLimit : wordLimit,
                    theme : theme,
                    reference : reference,
                };
            }
            else if(currentStageLevel === 3) {
                updateData = {
                    studentContent: studentContent,
                    writingInfo: {
                        theme: theme,
                        wordLimit: wordLimit
                    },
                    grammarResult: validateResult
                };
            }
            else if(currentStageLevel === 4) {
                updateData = {
                    studentContent: studentContent,
                    writingInfo: {
                        theme: theme,
                        wordLimit: wordLimit
                    }
                };
            }
            else if(currentStageLevel === 5) {
    
                updateData = {
                    studentContent: studentContent,
                    writingInfo: {
                        theme: theme,
                        wordLimit: wordLimit
                    }
                }
            }

            setStageData(updateData);
        }

        await setUpdatingData()
    }

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