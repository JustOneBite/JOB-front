'use client'

import {mainPage, getWritingData, updateStudentContent, incSubmitCnt, readStudentLesson, writingValidator} from "../../util/writingUtil"

import StartPage from "./stage0/startPage"
import ReferencePage from "./stage1/referencePage"
import FirstWritingPage from "./stage2/firstWritingPage"
import GrammarCheckPage from "./stage3/grammarCheckPage"
import TeacherFeedbackPage from "./stage4/teacherFeedbackPage"
import FinalSubmitPage from "./stage5/finalSubmitPage"
import styles from './writing.module.css'

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"; // useRouter 가져오기 

export default function WritingController() {

    // 모든 상태 변수 useRef로 변경
    const teacherFeedbackRef = useRef([])
    const submitCntRef = useRef(0)
    const themeRef = useRef('')
    const wordLimitRef = useRef('')
    const referenceRef = useRef([])
    const allocatedDateRef = useRef(null)
    const lessonIdRef = useRef(null)
    const curriculumIdRef = useRef(null)
    const validateResultRef = useRef([])

    const studentContentRef = useRef('') // studentContent를 useRef로 변경

    const stageData = useRef(null)
    // const [stageData, setStageData] = useState(null)
    const [isInitialUpdate, setIsInitialUpdate] = useState(false)

    const [currentStageLevel, setCurrentStageLevel] = useState(0)
    const [ComponentToRender, setComponentToRender] = useState(null)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const router = useRouter(); // useRouter 초기화


    const [modalOpen, setModalOpen] = useState(false);
    const modalBackground = useRef(); 


    useEffect(() => {
        const handleBeforeUnload = (event) => {
          event.preventDefault()
          event.returnValue = ""
        }

        window.addEventListener("beforeunload", handleBeforeUnload)
    
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload)
        }
      }, []) // 뒤로가기, 창 닫기, 새로고침 클릭 시 데이터 유실 경고 메시지 표출

    // 학생에게 배정된 curriculum 정보 요청
    useEffect(() => {
        const fetchData = async () => {
            try {
                const studentLessonId = "677fcc533e378bd9ea60afa1"
                const resultStudentData = await readStudentLesson(studentLessonId)

                studentContentRef.current = resultStudentData.studentData.content
                teacherFeedbackRef.current = resultStudentData.studentData.teacherFeedback
                submitCntRef.current = resultStudentData.studentData.submitCnt
                allocatedDateRef.current = resultStudentData.allocatedDate
                lessonIdRef.current = resultStudentData.lessonId
                curriculumIdRef.current = resultStudentData.curriculumId
                setCurrentStageLevel(submitCntRef.current)

                if(submitCntRef.current === 3){
                    await checkGrammar(resultStudentData.studentData.content)
                }

                const writingDataId = "67808eec1e3e336d7c41eba3"
                const resultWritingData = await getWritingData({ id: writingDataId })

                themeRef.current = resultWritingData.theme
                wordLimitRef.current = resultWritingData.wordLimit
                referenceRef.current = resultWritingData.references

            } catch (err) {
                setError(err.message) // 오류 발생 시 상태에 오류 메시지 저장
            } finally {
                setIsInitialUpdate(true)
                setLoading(false) // 로딩 상태 변경
            }
        }

        fetchData()
    }, [])

    useEffect(() => {
        handleSettingData()

        if (isInitialUpdate) {
            if (currentStageLevel === 0) {
                setComponentToRender(() => StartPage)
            } else if (currentStageLevel === 1) {
                setComponentToRender(() => ReferencePage)
            } else if (currentStageLevel === 2) {
                setComponentToRender(() => FirstWritingPage)
            } else if (currentStageLevel === 3) {
                setComponentToRender(() => GrammarCheckPage)
            } else if (currentStageLevel === 4) {
                setComponentToRender(() => TeacherFeedbackPage)
            } else if (currentStageLevel === 5) {
                setComponentToRender(() => FinalSubmitPage)
            }
        }

    }, [currentStageLevel, isInitialUpdate])

    const checkGrammar = async (contentData) => {
        const result = await writingValidator(contentData)
        validateResultRef.current = result
    }

    const handleCurrentStage = async (updateData) => {
        const updatingData = async (updateData) => {
            if(currentStageLevel === 1){
                submitCntRef.current += 1
            }
            if (currentStageLevel === 2) {
                studentContentRef.current = updateData.content
                submitCntRef.current += 1

                await checkGrammar(updateData.content)
            }
            else if (currentStageLevel === 3) {

                studentContentRef.current = updateData.content
                submitCntRef.current += 1
            }
            else if( currentStageLevel === 4){
                studentContentRef.current = updateData.content
                submitCntRef.current += 1
            }
            else if (currentStageLevel === 5) {
                studentContentRef.current = updateData.studentContent
                submitCntRef.current += 1
            }

            setCurrentStageLevel(currentStageLevel + 1)
        }

        console.log("update 됩니다!!")

        await updatingData(updateData)
    };

    const handleSettingData = () => {

            let updateData = null

            if (currentStageLevel === 0) {
                updateData = {
                    curriculumId: curriculumIdRef.current,
                    lessonId: lessonIdRef.current,
                    allocatedDate: allocatedDateRef.current,
                };
            }
            else if (currentStageLevel === 1) {
                updateData = {
                    reference: referenceRef.current
                };
            }
            else if (currentStageLevel === 2) {
                updateData = {
                    content: studentContentRef.current,
                    wordLimit: wordLimitRef.current,
                    theme: themeRef.current,
                    reference: referenceRef.current,
                };
            }
            else if (currentStageLevel === 3) {

                updateData = {
                    studentContent: studentContentRef.current,
                    writingInfo: {
                        theme: themeRef.current,
                        wordLimit: wordLimitRef.current
                    },
                    grammarResult: validateResultRef.current
                };
            }
            else if (currentStageLevel === 4) {
                updateData = {
                    studentContent: studentContentRef.current,
                    writingInfo: {
                        theme: themeRef.current,
                        wordLimit: wordLimitRef.current
                    }
                };
            }
            else if (currentStageLevel === 5) {
                updateData = {
                    studentContent: studentContentRef.current,
                    writingInfo: {
                        theme: themeRef.current,
                        wordLimit: wordLimitRef.current
                    }
                }
            }

            stageData.current = updateData
    }

    const endWritingStudy = async () => {
        // const clickEndButton = window.confirm("학습을 종료하시겠습니까? \n\n현재 페이지에서 작성하신 내용은 사라집니다.\n\n학습을 다시 시작하실 때는 이전 단계부터 시작됩니다.")

        await updateStudentContent("677fcc533e378bd9ea60afa1", studentContentRef.current, submitCntRef.current)
        router.push('/')
        
    }

    return (
        <div>
            <button onClick={() => setModalOpen(true)}>학습 종료</button>
            <div>
                {
                    modalOpen && 

                    <div className={styles.modalOverlay} ref={modalBackground} onClick={e => {
                        if (e.target = modalBackground.current) {
                            setModalOpen(false)
                        }
                    }}> 
                        <div className={styles.modalContainer}>
                            <h2 className={styles.modalTitle} >학습을 종료하시겠습니까?</h2>
                            <p className={styles.modalDescription} >종료하시면 이전 단계까지 저장됩니다.</p>
                            <div className={styles.buttonGroup}>
                            <button className={styles.buttonConfirm} onClick={() => setModalOpen(false)}>계속 학습하기</button> 
                            <button className={styles.buttonCancel} onClick={endWritingStudy}>종료하기</button>
                            </div>
                        </div>
                        
                    </div>
                }
            </div>
            {
                ComponentToRender ? (
                    <ComponentToRender
                        data={stageData.current}
                        onComplete={(updateData) => handleCurrentStage(updateData)}
                    />
                ) : (
                    <div>Loading...</div> // 로딩 상태 표시
                )
            }
        </div>
    )
}
