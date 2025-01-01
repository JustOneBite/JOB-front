import Head from 'next/head';
import NavBar from './navigationBar/page.js';
import styles from './page.module.css';


export default function MainPage(){
  const userId = '대준띠';

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Head>
          <title>Job 영어 Dashboard</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
  
        {/* Navigation Bar */}
        <NavBar />
  
        {/* Main Content */}
        <main className={styles.main}>
          {/* 유저 정보 및 수업 진행도 */}
          <div className={styles.grid}>
            {/* User Content */}
            <div className={styles.user}>
              <div className={styles.info}>
                <div>
                  <p className={styles.name}>{userId}님</p>
                  <p className={styles.teacher}>이름 | 담당선생님</p>
                </div>
              </div>
              <div className={styles.infoBtn}>
                <button className={styles.smallButton}>내 정보 수정</button>
                <button className={styles.smallButton}>로그아웃</button>
              </div>
            </div>
  
            {/* 오늘의 진행도 */}
            <div className={styles.progressGrid}>
              <div className={styles.message}>오늘 이만큼 했어요!</div>
              <div className={styles.progress}>
                <div className={styles.progressContainer}>
                  <div className={styles.circleProgress}>
                    <svg className={styles.progressSvg}>
                      <circle className={styles.circleBg} r="92" cx="106" cy="106"></circle>
                      <circle className={styles.circleFg} r="92" cx="106" cy="106"></circle>
                    </svg>
                    <div className={styles.progressText}>75%</div>
                  </div>
                  <p className={styles.note}>잘하고 있어요!</p>
                </div>
              </div>
            </div>
          </div>
  
          {/* Start Learning Button */}
          <div className={styles.startLearning}>
            <div className={styles.graphic}>
              <button className={styles.startButton}>오늘 학습 시작하기</button>
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
}