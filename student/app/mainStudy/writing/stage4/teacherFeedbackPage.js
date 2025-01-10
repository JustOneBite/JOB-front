'use client'

import { useEffect, useState } from "react"

export default function TeacherCheckSubmit({data, onComplete}) {

    const [writingText, setWritingText] = useState('') //학생이 작성하는 writing text 저장 (실시간 변경 가능).
    const [writingContent, setWritingContent] = useState('') //DB에 저장된 학생 writing content
    const [submitCount, setSubmitCount] = useState(0)

    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (data && data.studentContent !== undefined) {
            setWritingContent(data.studentContent);
            setWritingText(data.studentContent);
            setSubmitCount(data.submitCnt);
        } else {
            setErrorMessage("데이터가 로드되지 않았습니다.");
        }
    
        console.log(data, "teacherFeedBack");
    }, [data]);

    const handleSubmit = () =>{
        const returnData = {
            content: writingText,
        }
        return onComplete(returnData)
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
            <div>{errorMessage}</div>
        </div>
    )
}