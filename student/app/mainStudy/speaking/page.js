'use client'

import { getSpeakingData, readStudentLesson, getLessonInfo} from "../../util/speakingUtil"
import { useEffect, useState, useRef} from "react"
import SpeakingStartPage from "./stage1/page"
import SpeakingLessonPage from "./stage2/page"


export default function SpeakingController() {

    let stageData = useRef(null)

    let problemData = useRef([])
    let dataType = useRef(0)
    let allocatedDate = useRef(null)

    let lessonNum = useRef(12)
    let lessonName = useRef('My name is DaeJun')

    let currentStageLevel = useRef(1)

    const [isInitialUpdateReady,setIsInitialUpdateReady] =  useState(false)

    const [ComponentToRender, setComponentToRender] = useState(null)

    const [errorMessage, setErrorMessage] = useState(null)

    const [trigerUseEffect,setTrigerUseEffect] = useState(false)

    useEffect(() => {
        // 비동기 함수로 API 호출
        const fetchData = async () => {
            try 
            {

                const speakingData = await getSpeakingData("678212dbaf574dca32dc153b")
                problemData.current = speakingData.texts
                dataType = speakingData.type

                const lessonData = await readStudentLesson("677b977fe5c781a4dec77d34")

                if (lessonData) {
                    allocatedDate.current = new Date(lessonData.allocatedDate);
                }

                setIsInitialUpdateReady(true)

            } catch (err) {
                setErrorMessage(err.message); // 오류 발생 시 상태에 오류 메시지 저장
            }
        };

        fetchData();
    }, []);

    useEffect(() => {

        if(isInitialUpdateReady)
        {
            handleStageData()
            
            console.log(currentStageLevel.current,"why??")
            if(currentStageLevel.current === 1){
                setComponentToRender(()=>SpeakingStartPage)
            }else if(currentStageLevel.current === 2){
                setComponentToRender(()=>SpeakingLessonPage)
            }
        }
        

    }, [trigerUseEffect, isInitialUpdateReady])


    const handleStageData = () => {
        if(currentStageLevel.current == 1)
        {
            stageData.current = {
                lessonName: lessonName.current,
                lessonNum: lessonNum.current,
                allocatedDate: allocatedDate.current,
            };
        }
        else if(currentStageLevel.current == 2)
        {
            stageData.current = {
                problems : problemData,
            } 
        }
    }

    const handleCurrentStage = (updateData) => {
        currentStageLevel.current += 1

        setTrigerUseEffect(!trigerUseEffect)
    };

    return(
        <div>
            {
                ComponentToRender ? (
                    <ComponentToRender
                    data = { stageData.current }
                    onComplete={(updateData) => handleCurrentStage(updateData)}
                    />
                ) : (
                    <div>Loading...</div> // 로딩 상태 표시
                )
            }

            <div>{errorMessage}</div>
        </div>
    )
}