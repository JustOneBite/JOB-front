'use client'
import React from 'react';
import styles from "../styles/sSlistItem.module.css"; // 스타일 파일을 import
import Link from "next/link";
import { useState , useEffect } from 'react';

// 게시물 데이터 예시 (실제 데이터는 서버에서 가져와야됨)



const listItem = () => {
    const [posts , setPosts] = useState([]);
    

    useEffect(()=>{
        const fetchPosts = async() => {
            const res = await fetch('/api/posts');
            const data = await res.json();
            console.log(data)
            if(res.ok){
                setPosts(data.posts || [])

            }else{
                console.error('서버오류',res.message)
            }
        } 

        fetchPosts();
    },[]);

    

    return (
        <div className={styles.postList}>
        {posts.map((post, index) => (
            <div key={post.id} className={styles.navbar}>
            <div className={styles.navbarItem}>{index + 1}</div> {/* 번호는 인덱스에 1을 더해서 표시 */}
            <div className={styles.navbarItem}>{post.category}</div>
            <Link
                href={{
                    pathname: "/studentService/edit",
                    query: { postId: post.id, title: post.title },
                }}
                >
                <div className={styles.navbarItem} style={{ cursor: "pointer", color: "blue" }}>
                    {post.title}
                </div>
            </Link>
            <div className={styles.navbarItem}>{post.author}</div>
            <div className={styles.navbarItem}>{post.date}</div>
            <div className={styles.navbarItem}>{post.status ? '처리완료' : '답변대기'}</div>
            </div>
        ))}
        </div>
    );
    };

export default listItem;
