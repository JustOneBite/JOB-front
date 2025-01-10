'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"; // useRouter 가져오기

export default function Reference({data, onComplete}) {

    useEffect(() => {
        console.log(data)
    },[])

    const handleSubmit = (e) => {
        const updateData = null
        e.preventDefault()
        onComplete(updateData)
    }

    return (
        <div>

            <h2>레퍼런스 페이지</h2>
            {
                data.reference.length != 0 ?
                data.reference.map((refer,idx)=>{
                    return(
                        <div key={idx}>[{idx+1}] {refer}</div>
                    )
                })
                :
                <div>데이터가 없어요</div>
            }
            <button
                onClick={handleSubmit} 
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
                글쓰러 가기
            </button>
        </div>
    )
}