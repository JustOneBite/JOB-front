'use client'; 
import Link from 'next/link';
import styles from '../../styles/studentSVWrite.module.css';
import { useState } from 'react';

const writePage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);  // 제출 상태 관리

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      title: formData.get('title'),
      category: formData.get('category'),
      content: formData.get('content'),
      author: formData.get('author'),
    };

    try {
      const response = await fetch('/api/posts/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('서버응답', result);
        setIsSubmitted(true);  // 제출 성공 시 상태 변경
      } else {
        console.error('서버오류');
      }
    } catch (err) {
      console.error('요청실패', err);
    }
  };

  if (isSubmitted) {
    return (
      <div>
        <h2>글이 성공적으로 작성되었습니다!</h2>
        <p><a href="/studentService">메인 페이지로 돌아가기</a></p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>고객센터 - 글쓰기</h1>
      </header>
      <form onSubmit={handleSubmit}>
        <div className={styles.rowGroup}>
          <div className={`${styles.formGroup} ${styles.titleGroup}`}>
            <label className={styles.textLabel} htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              name="title"
              className={styles.titleInput}
              placeholder="제목을 입력하세요!"
              required
            />
          </div>

          <div className={`${styles.formGroup} ${styles.categoryGroup}`}>
            <label className={`${styles.textLabel} ${styles.rightTransposition}`} htmlFor="category">카테고리</label>
            <select id="category" name="category" className={`${styles.input} ${styles.rightTransposition}`} required>
              <option value="로그인">로그인</option>
              <option value="회원가입">회원가입</option>
              <option value="기타">기타</option>
            </select>
          </div>

          <div className={`${styles.formGroup} ${styles.authorGroup}`}>
            <label className={styles.textLabel} htmlFor="author">등록자</label>
            <input
              type="text"
              id="author"
              name="author"
              className={styles.input}
              placeholder="작성자"
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.textLabel} htmlFor="content">내용</label>
          <textarea
            id="content"
            name="content"
            className={styles.textarea}
            placeholder="내용을 입력해주세요"
            required
          ></textarea>
        </div>

        <div className={styles.buttons}>
          <button type="submit" className={styles.btnSubmit}>
            등록하기
          </button>
          <Link href="/studentService" className={styles.btnCancel}>
            목록보기
          </Link>
        </div>
      </form>
    </div>
  );
};

export default writePage;
