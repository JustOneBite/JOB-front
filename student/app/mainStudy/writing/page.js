'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"; // useRouter 가져오기 

export default function Writing() {

    const router = useRouter(); // useRouter 초기화

    const [textBookInfo, setTextBookInfo] = useState('')
    // const type = ["vocab", "reading", "writing", "listening", "speaking"]

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // 학생에게 배정된 curriculum 정보 요청
    useEffect(() => {
        // 비동기 함수로 API 호출
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/curriculum/get', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',  // Content-Type을 JSON으로 설정
                    },
                    body: JSON.stringify({
                        curriculumId: "6777ec2bc40d6f4cfbc496b1", // useEffect로 커리큘럼 정보 받아와야 함.
                    }),
                    credentials: 'include'  // 쿠키를 포함하려면 이 설정 추가
                })
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const temp_result = await response.json();
                const result = temp_result.result

                setTextBookInfo( result.textBookInfo[0] ) //textBook title 저장

            } catch (err) {
                setError(err.message); // 오류 발생 시 상태에 오류 메시지 저장
            } finally {
                setLoading(false); // 로딩 상태 변경
            }
        };

        fetchData();
    }, []);

    // type, lesson num, date는 이전 페이지에서 불러옴.
    return (
        <div>
            <h4>Writing</h4>
            <p>{textBookInfo}</p>
            <p>학습레슨</p>
            <h5>1월 1일 ㅋ</h5>
            {/* 버튼 추가 */}
            <button
                onClick={() => router.push('./writing/reference')} // 클릭 시 /reference로 이동
                style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    backgroundColor: "#0070f3",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                학습하기
            </button>
        </div>
    )
}