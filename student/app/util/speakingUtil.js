export async function getSpeakingData(id) {
    try {
        const response = await fetch('http://localhost:8080/speakingData/read', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id : id
            }),
            credentials: 'include',
        });

        if (!response.ok) {
            const er = await response.json()
            console.log(er.message)
            throw new Error(`HTTP error! status: ${response.status} message :  ${er.message}`);
        }

        const temp_result = await response.json();
        const result = temp_result.result

        return result;

    } catch (error) {
        throw new Error(error.message || "말하기 학습 데이터 읽기 중 문제 발생");
    }
}

export async function readStudentLesson(studentLessonId){
    try{

        const response = await fetch('http://localhost:8080/studentLesson/read', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',  // Content-Type을 JSON으로 설정
            },
            body: JSON.stringify({
                    searchType: 1,
                    id: studentLessonId,
            }),
            credentials: 'include'  // 쿠키를 포함하려면 이 설정 추가
        })

        if(!response.ok){
            const er = await response.json()
            console.log(er.message)
            throw new Error(`HTTP error! status: ${response.status} message :  ${er.message}`);
        }

        const temp_result = await response.json()
        const result = temp_result.result

        return result

    } catch(error){
        throw new Error("")
    }
}

export async function getLessonInfo(lessonId){
    try{

        const response = await fetch('http://localhost:8080/lesson/get', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',  // Content-Type을 JSON으로 설정
            },
            body: JSON.stringify({
                    _id: lessonId
            }),
            credentials: 'include'  // 쿠키를 포함하려면 이 설정 추가
        })

        if(!response.ok){
            const er = await response.json()
            console.log(er.message)
            throw new Error(`HTTP error! status: ${response.status} message :  ${er.message}`);
        }

        const temp_result = await response.json()
        if(Array.isArray(temp_result) && temp_result.length == 0)
            throw new Error("검색 설정 오류 및 검색 결과 없음")
        const result = temp_result[0]

        return result

    } catch(error){
        throw new Error("")
    }
}
