// pages/api/posts/submit.js
import { posts } from '../../../data';  // 예시 데이터

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // 클라이언트로부터 데이터 받기
    const { title, category, content, author } = req.body;

    // 데이터 유효성 검사 (예시)
    if (!title || !category || !content || !author) {
      return res.status(400).json({ message: '모든 필드를 입력해야 합니다.' });
    }

    const date = new Date();
    const formattedDate = date.toLocaleDateString('ko-KR').replace(/\./g, '-').replace(/\s/g, ''); // '2024-12-26'

    // 새로운 게시물 추가
    const newPost = {
      id: posts.length + 1,  // 임시 ID 생성 (예시)
      title,
      category,
      content,
      author,
      date: formattedDate,
      status: '대기',
    };

    posts.push(newPost);  // 게시물 목록에 추가 (실제 DB와 연결할 때는 DB에 추가)
    // console.log('여기 제출 컴포넌트',posts)
    res.setHeader('Cache-Control', 'no-store');
    // 응답 보내기
    return res.status(200).json({ message: '글이 성공적으로 작성되었습니다.', post: newPost });
  }

  // POST 요청이 아닌 경우
  res.status(405).json({ message: '허용되지 않은 HTTP 메서드입니다.' });
}
