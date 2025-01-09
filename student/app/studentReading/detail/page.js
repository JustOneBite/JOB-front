// 'use client' directive ensures client-side rendering
'use client';
import { useState, useEffect } from "react";
import styles from '../../styles/studentStudyStart.module.css';
import { useSearchParams , useRouter} from "next/navigation";
import ContentDisplay from './EngProblem'
import KorContentDisplay from './KorProblem'


export default function StudentReading() {
  const searchParams = useSearchParams();
  const unit = searchParams.get("unit");
  const lessonTitle = searchParams.get("title");
  const curriculumId = searchParams.get("DataId");
  const lessonId = searchParams.get("DataId");
  const router = useRouter();

  const [readingData, setReadingData] = useState({}); // API에서 받은 데이터를 저장
  const [problemIndex, setProblemIndex] = useState(0); // 문제 인덱스 



  useEffect(() => {
    const fetchPostData = async () => {
      try {
        // 요청에 필요한 데이터 준비
        const requestData = {
          // DataId: DataId, // 실제 서버로 보낼 REQ
          curriculumId: curriculumId,
          lessonId: lessonId,
          lesson: lessonTitle,   // 테스트 서버용
          curriNum: unit, // 테스트 서버용 
        };
  
        // fetch 요청 보내기
        const res = await fetch(`/api/posts/reading`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        });
  
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
  
        const postData = await res.json();
        setReadingData(postData);
      } catch (err) {
        console.error('Error fetching post data:', err);
      } 
    };
  
  
    fetchPostData();
  }, [lessonTitle, unit]);

  const handleNext = () => {
    setProblemIndex((prevIndex) => (prevIndex !== null ? prevIndex + 1 : 0));
  };
  
  const handlePrevious = () => {
    setProblemIndex((prevIndex) => (prevIndex !== null ? prevIndex - 1 : 0));
  };


  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => router.push('/')}>
          &#8592;
      </button>
      {readingData.content ? (<>
        <ContentDisplay
          title={readingData.content.title}
          unit={readingData.content.unit}
          engContent={readingData.content.eng}
          korContent={readingData.content.kor}
          problemIndex={problemIndex}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
        /></>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    );
}
