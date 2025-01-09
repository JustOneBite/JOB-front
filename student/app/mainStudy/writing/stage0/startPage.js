'use Client'

export default function StartPage(textBookInfo, lessonNum, currentDate){
    return (
        <div>
            <h4>Writing</h4>
            <p>{textBookInfo}</p>
            <p>{lessonNum}</p>
            <h5>{currentDate}</h5>
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