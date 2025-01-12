'use client'

import { useEffect, useState } from "react"

export default function WritingStart({data, onComplete}) {
    const [reference, setReference] = useState([])
    const [content, setContent] = useState('')
    const [wordLimit, setWordLimit] = useState(0)
    const [theme, setTheme] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        // 비동기 함수로 API 호출
        setContent(data.content)
        setTheme(data.theme)
        setWordLimit(data.wordLimit)
        setReference(data.reference)

    }, []);

    useEffect(() => {
            const handleBeforeUnload = (event) => {
              event.preventDefault()
              event.returnValue = ""
            }
        
            return () => {
                window.removeEventListener("beforeunload", handleBeforeUnload)
            }
          }, []) // 뒤로가기, 창 닫기, 새로고침 클릭 시 데이터 유실 경고 메시지 표출

    const handleChange = (e) => {
        setContent(e.target.value);
    }

    const countWords = (text) => {
        return text.length
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const updateData = {
            content : content,
        }
        onComplete(updateData)
    }


    return (
        <div>
            <div className="p-20">
                <h4>{theme}</h4>
                
                <textarea
                    name="content"
                    value={content}
                    onChange={handleChange}
                    maxLength={wordLimit}
                    placeholder="글을 작성하세요"
                />
                <p>남은 글자수 {wordLimit - countWords(content)}</p>
                <button onClick={handleSubmit} disabled={countWords(content) === 0}> 1차 문법 검사 </button>
                
            </div>

            <div>{ errorMessage }</div>
        </div>
    )
}
