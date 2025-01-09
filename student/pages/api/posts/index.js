// pages/api/posts/index.js

import { posts } from '../../../data'
  
  export default function handler(req, res) {
    if (req.method === 'GET') {
      // GET 요청 시 게시물 목록 반환

      // console.log('여기 서버',posts)
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json({ posts });
    }
  
    // 다른 메서드는 처리하지 않음
    res.status(405).end(); // Method Not Allowed
  }
  