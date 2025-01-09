"use client";
import styles from '../../styles/studentSVEdit.module.css';
import { useSearchParams } from "next/navigation";
import { useState , useEffect, use } from "react";
import Form from './form';


const EditPage = () => {
  const searchParams = useSearchParams();
  const postId = searchParams.get("postId");
  const title = searchParams.get("title");

  // 요 4개 설정은 테스트용입니다. 
  // const data = posts[postId-1];
  // const [status, setStatus] = useState(data.status);
  // const [content, setContent] = useState(data.content);
  // const [category, setCategory] = useState(data.category);

  const [status , setStatus] = useState(null);
  const [content , setContent] = useState('');
  const [category , setCategory] = useState('');
  
  const [answer , setAnswer] = useState('');
  const [loading , setLoading] = useState(true);

// 렌더링이 될때 get요청 
  useEffect(()=>{
    const fetchPostData = async () => {
      try{
        const res = await fetch(`/api/posts/${postId}`);
        if(!res.ok){
          throw new Error('Failed to fetch data');
        }
        const postData = await res.json();

        // console.log(postData);

        setStatus(postData.post.status);
        setContent(postData.post.content);
        setCategory(postData.post.category);
        setAnswer(postData.post.answer);
      } catch (err){
        console.error('Error fetching post Data:', err);
      } finally {
        setLoading(false);
      }
    };

    if(postId){
      fetchPostData();
    }

  }, [postId])


// 버튼을 누렀을때 post요청 
  const handleEditClick = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/posts/updatePost', {
        method: 'POST', // 또는 PUT 요청 사용 가능
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          title, 
          category, 
          content, 
          status: status, // 상태도 함께 전송
        }),
      });

      if (response.ok) {
        alert('수정된 내용이 저장되었습니다.');
      } else {
        console.error('수정 요청에 실패했습니다.');
      }
    } catch (error) {
      console.error('서버와 연결하는 중 오류가 발생했습니다.', error);
    }
  }

  const handleDeleteClick = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/posts/updatePost', {
        method: 'Delete', // 또는 PUT 요청 사용 가능
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          title, 
          category, 
          content, 
          status: status, // 상태도 함께 전송
        }),
      });

      if (response.ok) {
        alert('수정된 내용이 삭제된거 처럼되었습니다.');
      } else {
        console.error('수정 요청에 실패했습니다.');
      }
    } catch (error) {
      console.error('서버와 연결하는 중 오류가 발생했습니다.', error);
    }
  }


  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handleContentChange = (e) => setContent(e.target.value);
  


  return (
    <div className={styles.container}>
      <h1 className={styles.title}>고객센터 - 글수정</h1>

      {/* Form 컴포넌트에 필요한 props 전달 */}
      <Form
        postId={postId}
        title={title}
        category={category}
        content={content}
        status={status}
        answer={answer}
        onCategoryChange={handleCategoryChange}
        onContentChange={handleContentChange}
        onSubmit={handleEditClick}
        onDelete={handleDeleteClick}
      />
    </div>
  );
};

export default EditPage;
