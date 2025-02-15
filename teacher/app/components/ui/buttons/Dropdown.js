"use client";

import { useState, useRef, Children, useEffect, cloneElement } from "react";
import { containsHangeul, containsChoseong, isHangeul } from "@/app/utils/hangeul";
import ArrowIcon from "@/public/assets/images/icons/dropdownArrow.svg";
import styles from "./dropdown.module.css";

export function DropdownElement({ label, value, onClick, type }) {
  return (
    <li className={`${styles["dropdown-item"]} ${styles[type]}`} onClick={() => onClick({ label, value })}>
      {label}
    </li>
  );
}

export function DropdownButton({ 
  children,
  onSelect, 
  placeholder = "옵션 선택", 
  width = 200,
  stretch = false,
  allowCustom = false,
  search = false,
  type,
}) {
  const [state, setState] = useState("default");
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setState("default");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    setSelected(item);
    setSearchQuery("");
    setState("default");
    if (onSelect) onSelect(item);
  };

  const toggleOpenState = () => { 
    if (state === "custom") return;
    setState(state === "opened" ? "default" : "opened"); 
  };
  
  const toggleCustomState = () => { 
    setState("custom"); 
    setTimeout(() => { if (inputRef.current) inputRef.current.focus(); }, 0);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
  };

  const handleCustomInputSubmit = () => {
    if (searchQuery.trim() !== "") {
      const newValue = { label: searchQuery, value: searchQuery };
      setSelected(newValue);
      if (onSelect) onSelect(newValue);
    }
    setState("default");
  };

  const handleCustomInputKeyDown = (event) => {
    if (event.key === "Enter") {
      handleCustomInputSubmit();
    }
  };

  const handleCustomInputBlur = () => {
    console.log('asdfasdf');
    handleCustomInputSubmit();
  };

  const selectedWidget = (
    <>
      {selected ? selected.label : placeholder}
      <div className={styles["dropdown-arrow"]}><ArrowIcon /></div>
    </>
  );

  const textField = (
    <input 
      ref={inputRef} 
      className="ko-md-15" 
      type="text" 
      placeholder="직접입력" 
      value={searchQuery}
      onChange={handleInputChange}
      onBlur={handleCustomInputBlur} 
      onKeyDown={handleCustomInputKeyDown}
    />
  );

  const elements = Children.map(children, (child) =>
    cloneElement(child, { onClick: handleSelect, type: type })
  );

  const filteredElements = search 
    ? elements?.filter((child) => {
        const query = searchQuery.toLowerCase();
        const label = child.props.label.toLowerCase();

        if (isHangeul(query)) {
          if (containsHangeul(label, query)) return true;
          if (containsChoseong(label, query)) return true;
        }

        return label.includes(query);
      })
    : elements;

  width = stretch ? "100%" : width;

  return (
    <div 
      className={`${styles["dropdown-container"]} ${styles[state]} ${selected ? styles["selected"] : ""} ${styles[type]}`} 
      ref={dropdownRef} 
      style={{ width: stretch ? "100%" : width }}
    >
      <button 
        className={`${styles["dropdown-button"]} ko-md-15`} 
        onClick={toggleOpenState}
      >
        <span className={styles["dropdown-button-inner"]}>
            {state === "custom" ? textField : selectedWidget}
        </span>
      </button>
      <ul className={`${styles["dropdown-list"]} ko-sb-15 ${styles[state]} ${searchQuery === "" ? "" : search ? styles["typed"] : ""}`}>
        {allowCustom && <li className={styles["dropdown-item"]} onClick={toggleCustomState}>직접입력</li>}
        
        {filteredElements.length > 0 
          ? filteredElements 
          : search 
            ? <li className={styles["dropdown-item"]}>{`검색 결과 없음`}</li>
            : elements
        }
      </ul>
    </div>
  );
}

export function DropdownButton1(props) {
  return <DropdownButton {...props} type="button1">{props.children}</DropdownButton>;
}
export function DropdownButton2(props) {
  return <DropdownButton {...props} type="button2">{props.children}</DropdownButton>;
}