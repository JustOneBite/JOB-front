// pages/api/posts/index.js

import { getPostById } from '../../../DBdata'  

export default async function handler(req, res) {
    const { postId } = req.query;
    // console.log(postId);

    if (req.method === 'GET') {
    // GET 요청 시 게시물 목록 반환

    const post = await getPostById(postId)


    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ post });
    }
  
    // 다른 메서드는 처리하지 않음
    res.status(405).end(); // Method Not Allowed
  }
  