


export async function getWritingData(id) {
    try {
        const response = await fetch('http://localhost:8080/writingData/read', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id.id
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
        throw new Error(error.message || "글쓰기 학습 데이터 읽기 중 문제 발생");
    }
}


export async function updateStudentContent(id,studentContent, submitCnt){
    try{
        const response = await fetch('http://localhost:8080/studentLesson/updateStudentData', {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                studentData: {
                        content: studentContent,
                        submitCnt: submitCnt
                    }
            
            }),
            credentials: 'include',
        });

        if (!response.ok) {
            const er = await response.json()
            console.log(er.message)
            throw new Error(`HTTP error! status: ${response.status} message :  ${er.message}`);
        }

        const res = await response.json()
        console.log(res.result)

        return res.result
    }
    catch(e){
        throw new Error("컨텐츠 업데이트 중 문제 발생");
    }
}

export async function incSubmitCnt(id){
    try{
        const response = await fetch('http://localhost:8080/studentLesson/incSubmitCnt', {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
            }),
            credentials: 'include',
        });

        if (!response.ok) {
            const er = await response.json()
            console.log(er.message)
            throw new Error(`HTTP error! status: ${response.status} message :  ${er.message}`);
        }

    }
    catch(e){
        throw new Error("제출 횟수 증가 중 문제 발생");
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

//문법 검사용
export async function writingValidator(studentContent){
    try{
    
        const response = await fetch("http://localhost:8080/validator/writing", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                content: studentContent,
            }),
            credentials: "include",
        });

        if (!response.ok) {
            const er = await response.json()
            console.log(er.message)
            throw new Error(`HTTP error! status: ${response.status} message :  ${er.message}`);
        }

        const temp_result = await response.json();
        const result = temp_result.grammarIssues

        return result;

    }catch(error){
        throw new Error("문법 검사 중 오류 발생")
    }
}


export async function getCurriculumName(curriculumId){
    try{
    
        const response = await fetch("http://localhost:8080/curriculum/get", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                _id: curriculumId,
            }),
            credentials: "include",
        });

        if (!response.ok) {
            const er = await response.json()
            console.log(er.message)
            throw new Error(`HTTP error! status: ${response.status} message :  ${er.message}`);
        }

        const temp_result = await response.json();
        const result = temp_result[0].name

        return result;

    }catch(error){
        throw new Error("커리큘럼 이름 조회 중 오류 발생")
    }
}

export async function getLessonNum(lessonId){
    try{
    
        const response = await fetch("http://localhost:8080/lesson/get", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                _id: lessonId,
            }),
            credentials: "include",
        });

        if (!response.ok) {
            const er = await response.json()
            console.log(er.message)
            throw new Error(`HTTP error! status: ${response.status} message :  ${er.message}`);
        }

        const temp_result = await response.json();
        const result = temp_result[0].lessonNumber

        return result;

    }catch(error){
        throw new Error("유닛 번호 조회 중 오류 발생")
    }
}


