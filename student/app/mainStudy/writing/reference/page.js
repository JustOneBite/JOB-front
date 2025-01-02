'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"; // useRouter 가져오기

export default function Reference() {

    const router = useRouter(); // useRouter 초기화

    return (
        <div>
            <button
                onClick={() => router.push('./writingStart')} // 클릭 시 /reference로 이동
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
                문법 학습하기
            </button>
        </div>
    )
}