'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"; // useRouter 가져오기

export default function TeacherCheckSubmit() {

    const router = useRouter(); // useRouter 초기화

    return (
        <div>
            <button
                onClick={() => router.push('./finalSubmit')} // 클릭 시 /reference로 이동
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
                최종 제출
            </button>
        </div>
    )
}