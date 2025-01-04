import styles from './page.module.css';
import Link from 'next/link';

export default function Speaking() {
    const date = new Date();

    return(
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.backBtn}>
                    <Link href="../../page.js">
                        뒤로가기
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