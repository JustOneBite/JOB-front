// 'use client' directive ensures client-side rendering
'use client';
import { useRouter } from "next/navigation";
import styles from '../styles/studentStudyStart.module.css';
import Link from "next/link";


export default function StudentReading() {
  const router = useRouter();  
  
  // 커리큘럼 페이지에서 Link 태그로 받는다고 가정 ( query 로 )  
  const currentLesson = "Word Master";
  const currentCurriNum = 1; // 몇일차 학습 ㅁㅁ 이런느낌 
  const currentDate = "25.01.01"
  const DataId = new Object("Oxdddddddd")
  const curriculumId = new Object("Oxdddddddd");
  const lessonId = new Object("Oxdddddddd");

  return (
        <div className={styles.container}>
            {/* Back Button */}
            <button className={styles.backButton} onClick={() => router.push('/')}>
                &#8592;
            </button>

            {/* Content Area */}
            <div className={styles.contentArea}>
                <h2 className={styles.title}>Voca</h2>
                <p className={styles.subtitle}>{currentLesson}</p>
                <p className={styles.unitLesson}>unit/{currentCurriNum}</p>
                <p className={styles.date}>{currentDate}</p>

                {/* Start Button */}
                <Link style={{ textDecoration: 'none' }}
                href={{
                    pathname: "/studentReading/detail",
                    query: { unit: currentCurriNum, title: currentLesson , lessonId: lessonId , curriculumId:curriculumId},
                }}
                >
                
                <div className={styles.startButton} style={{ cursor: "pointer", textDecoration: "none"}}>
                    학습하기
                </div>
                </Link>
            </div>
        </div>
    );
}
