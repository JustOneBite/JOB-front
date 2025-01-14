import styles from './page.module.css';
import Link from 'next/link';

export default function SpeakingStartPage({data, onComplete}) {

    const handleSubmit = () => {
        onComplete([])
    };
    
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                {/* 뒤로 가기 버튼 */}
                <div className={styles.backBtn}>
                    {/* Google Fonts Material Symbols 사용 */}
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=arrow_back"
                    />
                    <Link href="../../page.js">
                        <span
                            className="material-symbols-outlined"
                            style={{ fontSize: '40px', color: 'black' }}
                        >
                            arrow_back
                        </span>
                    </Link>
                </div>
    
                {/* 타이틀 */}
                <div className={styles.title}>
                    <p>Speaking</p>
                </div>
    
                {/* 서브 타이틀 */}
                <div className={styles.subTitle}>
                    <p>
                        {data.lessonName}
                        <br />
                        {data.lessonNum}
                    </p>
                </div>
    
                {/* 날짜 표시 */}
                <div className={styles.date}>
                    <p>
                        {data.allocatedDate.getMonth() + 1}월 {data.allocatedDate.getDate()}일
                    </p>
                </div>
    
                
                {/* <div className={styles.startBtn} onClick={handleSubmit}>
                    <Link href="speaking/speakingLesson" className={styles.start}>
                        학습 시작하기
                    </Link>
                </div> */}
                {/* 학습 시작 버튼 */}
                <div className={styles.startBtn} onClick={handleSubmit}>
                    <span className={styles.start}>
                        학습 시작하기
                    </span>
                </div>
            </div>
        </div>
    );


    return(
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.backBtn}>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=arrow_back" />
                    <Link href="../../page.js">
                        <span class="material-symbols-outlined" style={{ fontSize: '40px', color: 'black' }}>arrow_back</span>
                    </Link>
                </div>

                <div className={styles.title}>
                    <p>Speaking</p>
                </div>
                <div className={styles.subTitle}>
                    <p>{data.lessonName}<br/>{data.lessonNum}</p>
                </div>
                <div className={styles.date}>
                    <p>{date.getMonth()+1}월 {date.getDate()}일</p>
                </div>
                <div className={styles.startBtn}>
                    <Link href="speaking/speakingLesson" className={styles.start}>
                        학습 시작하기
                    </Link>
                </div>
            </div>
        </div>
    )
    
}