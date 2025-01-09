import { useState } from "react";
import styles from "../styles/studentService.module.css";
import Link from "next/link";

const Filter = ({ onCategoryChange, onSortChange }) => {
  const [categoryActive, setCategoryActive] = useState(false);
  const [latestActive, setLatestActive] = useState(false);
  const [titleActive, setTitleActive] = useState(false);
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);

  const handleToggle = (type) => {
    if (type === "category") {
      setCategoryActive(!categoryActive);
      setCategoryDropdownVisible(!categoryDropdownVisible);
      setLatestActive(false);
      setTitleActive(false);
      onCategoryChange(!categoryActive);
    } else if (type === "latest") {
      setCategoryDropdownVisible(false);
      setLatestActive(!latestActive);
      setTitleActive(false);
      onSortChange("latest");
    } else if (type === "title") {
      setCategoryDropdownVisible(false);
      setTitleActive(!titleActive);
      setLatestActive(false);
      onSortChange("title");
    }
  };

  return (
    <div className={styles.filters}>
      <div className={styles.toggleButtons}>
        <button
          className={categoryActive ? styles.active : ""}
          onClick={() => handleToggle("category")}
        >
          카테고리
        </button>

        {categoryDropdownVisible && (
          <div className={styles.categoryDropdown}>
            <button>로그인</button>
            <button>버그제보</button>
          </div>
        )}

        <button
          className={latestActive ? styles.active : ""}
          onClick={() => handleToggle("latest")}
        >
          최신순
        </button>
        <button
          className={titleActive ? styles.active : ""}
          onClick={() => handleToggle("title")}
        >
          제목
        </button>
      </div>

      <input
        type="text"
        placeholder="제목 검색"
        className={styles.searchInput}
      />

     
      <Link className={styles.writeBtn}
      href='/studentService/write'>글쓰기
      </Link>
      
    </div>
  );
};

export default Filter;
