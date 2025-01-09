'use client'
import { useState } from "react";
import styles from "../styles/studentService.module.css";  // CSS 파일을 임포트
import Filter from "./filter"; // 필터 컴포넌트 가져오기
import ListItem from "./listItem";

export default function studentService() {
    const [categoryActive, setCategoryActive] = useState(false);
    const [sortType, setSortType] = useState(""); // 'latest' 또는 'title'
  
    // 카테고리 상태 업데이트
    const handleCategoryChange = (active) => {
        setCategoryActive(active);
    };

    // 정렬 방식 변경
    const handleSortChange = (type) => {
        setSortType(type);
    };
    
    return (
      <div className={styles.container}>
        {/* 헤더 */}
        <header className={styles.header}>
          <h1>고객센터</h1>
        </header>
  
        {/* 필터 컴포넌트 사용 */}
        <Filter onCategoryChange={handleCategoryChange} onSortChange={handleSortChange} />
        
        <nav className={styles.navbar}>
            <div className={styles.navbarItem}>번호</div>
            <div className={styles.navbarItem}>카테고리</div>
            <div className={styles.navbarItem}>제목</div>
            <div className={styles.navbarItem}>등록자</div>
            <div className={styles.navbarItem}>등록일</div>
            <div className={styles.navbarItem}>상태</div>
        </nav>

        {/* 게시물 목록 */}
        <ListItem/>

      </div>
    );
}