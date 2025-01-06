import styles from './page.module.css';
import Link from 'next/link';

export default function Speaking() {
    const date = new Date();

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
                    <p>교재이름<br/>학습유닛/레슨</p>
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