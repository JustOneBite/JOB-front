'use client'
import { useEffect, useState } from "react"

export default function Writing(){
    
    const [writing, setWriting] = useState('')
    const [writingInfo, setWritingInfo] = useState({title:'', wordLimit: 0})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [submitCount, setSubmitCount] = useState(0)
    const [grammerResult, setGrammerResult] =  useState(null)

    const btnTitleArr = ['1차 문법 검사', '2차 선생님 검사', '최종 제출']
    const [btnTitle, setBtnTitle] = useState(btnTitleArr[0])

    useEffect(() => {
        // 비동기 함수로 API 호출
            const fetchData = async () => {
                try {
                    const response = await fetch('http://localhost:8080/mainStudy/readWritingData', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',  // Content-Type을 JSON으로 설정
                        },
                        body: JSON.stringify({
                            theme: "a"
                        }),
                        credentials: 'include'  // 쿠키를 포함하려면 이 설정 추가
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const result1 = await response.json();
                    const result = result1.writingData

                    setWritingInfo({title: result.theme, wordLimit: result.wordLimit}); // 응답에서 받은 writingInfo 저장장
                    setWriting(result.studentContent)
                    setSubmitCount(result.submitCnt)
                } catch (err) {
                    setError(err.message); // 오류 발생 시 상태에 오류 메시지 저장
                } finally {
                    setLoading(false); // 로딩 상태 변경
                }
            };
    
            fetchData();
        }, []);

    useEffect(() => {
        if (submitCount < btnTitleArr.length) {
            setBtnTitle(btnTitleArr[submitCount]);
        }
    }, [submitCount]); // submitCount가 변경될 때 실행

    if (loading) return <div>Loading...</div>; // 로딩 중일 때 
    if (error) return <div>Error: {error}</div>; // 오류 발생 시

    const countWords = (text) => {
        if(!text)
            return 0;
        // 텍스트에서 공백을 기준으로 단어를 분리한 후, 빈 문자열을 제외한 단어 수를 계산
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    };

    const handleChange = (e) => {
        const inputText = e.target.value;
        const wordCount = countWords(inputText);

        // 단어 수가 제한을 넘지 않도록 제한
        if (wordCount <= writingInfo.wordLimit) {
            setWriting(inputText); // 단어 수가 제한 내에 있으면 입력값을 업데이트
        }
    };

        // const handleSubmit = async (e) => {
        //     e.preventDefault();  // 페이지 리로딩 방지
        //     // 추가적으로 제출할 때 실행할 로직을 여기에 작성

        //     const res = await fetch('http://localhost:8080/mainStudy/writing', {
        //         method : "POST",
        //         headers : {'Content-Type' : 'application/json'},
        //         body: JSON.stringify({writing})
        //     })

        //     const grammerData = res.json()
        //     setGrammerResult(grammerData)
            
        // };

        const handleClick = async() => {
            try {
                const response = await fetch('http://localhost:8080/mainStudy/saveWritingData', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',  // Content-Type을 JSON으로 설정
                    },
                    body: JSON.stringify({
                        theme : writingInfo.title,
                        studentContent : writing,
                        }),
                    credentials: 'include'  // 쿠키를 포함하려면 이 설정 추가
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                alert('저장 성공이다제!')

                setWritingInfo({title: result.theme, wordLimit: result.wordLimit, submitCount: result.submitCnt}); // 응답에서 받은 writingInfo 저장장

            } catch (err) {
                setError(err.message); // 오류 발생 시 상태에 오류 메시지 저장
            }
        };

    return (
        <div className="p-20">
            <h4>{writingInfo.title}</h4>
            <form>
                <textarea
                    name="content"
                    value={writing}
                    onChange={handleChange}
                    placeholder="글을 작성하세요"
                />
                <p>{writingInfo.wordLimit - countWords(writing)} 단어 남음</p>  {/* 남은 단어 수 표시 */}
                <button type="submit" onClick = {handleClick} disabled={countWords(writing) === 0 || submitCount === writingInfo.submitCount + 1}>{btnTitle}</button>
            </form>
            {/* {result && (
                <div>
                    <h2>Grammar Issues:</h2>
                    {result.matches && result.matches.map((match, index) => (
                        <div key={index}>
                            <p>{match.message}</p>
                            <p>Issue: {match.context.text}</p>
                        </div>
                    ))}
                </div>
            )} */}
        </div>
    )
}