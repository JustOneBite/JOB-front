'use client'
import { useEffect, useState } from 'react';

export default function listening() {
    const [listeningData, setListeningData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [textInput, setTextInput] = useState('');
    let isCorrect = false;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/mainStudy/readListeningData', 
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: "youtube"
                    }),
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                setListeningData(result.existingListeningData); 

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const renderTextWithUnderline = (text) => {
        // 문장을 단어로 분리
        const words = text.split(' ')
        
        return words.map((word, index) => {
            if (word.toLowerCase() === 'null') {
                // "null"인 경우 빨간 밑줄과 텍스트 입력 필드를 제공
                return (
                    <span key={index} style={{ borderBottom: '2px solid red', display: 'inline-block' }}>
                        <input
                            type="text"
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder="단어 입력"
                            maxLength= '100'
                            style={{ width: '100px', border: 'none', outline: 'none' }}
                        />
                    </span>
                )
            } else {
                // "null"이 아닌 단어는 검정색 밑줄을 표시
                return (
                    <span key={index} style={{ borderBottom: '2px solid black', margin : '10px' }}>
                        {word}
                    </span>
                );
            }
        })
    }

    const checkListeningAnswer = (answer) => {
        if(answer === textInput) {
            isCorrect = true; //se
        }
    }

    return (
        <div>
            <h1>{listeningData.title}</h1>
            <div>
                <iframe 
                    src={listeningData.url} // 백엔드에서 가져온 임베드 URL
                    title={listeningData.title} 
                    allowFullScreen
                >
                </iframe>
            </div>
            
            <form onSubmit={checkListeningAnswer(listeningData.answer)}>
                <div style={{ marginTop: '20px' }}>
                    {renderTextWithUnderline(listeningData.text)}
                </div>
                <button type='submit'>정답 제출</button>
            </form>

        </div>
    );
}
