import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div> Welcome to JOB Project<br></br>
            <Link href="/studentReading">학습하기</Link>
            <br></br>
            <Link href="/studentService">고객센터</Link>
    </div>
    
  );
}
