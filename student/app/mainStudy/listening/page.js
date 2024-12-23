'use client'
import { useEffect, useState } from 'react';

export default function listening() {
    const [listeningData, setListeningData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                // 백엔드의 응답 데이터 구조를 기반으로 상태 업데이트
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

    return (
        <div>
            <h1>{listeningData.title}</h1>
            <div style={{ position: 'relative', height: '0', paddingBottom: '56.25%' }}>
                <iframe 
                    src={listeningData.url} // 백엔드에서 가져온 임베드 URL
                    width="1024" 
                    height="576" 
                    title={listeningData.title} 
                    style={{ position: 'absolute', left: '50%', top: '30%', width: '40%', height: '40%', transform: 'translate(-50%, -50%)'}}
                    scrolling="yes" 
                    allowFullScreen
                >
                </iframe>
            </div>
        </div>
    );
}


