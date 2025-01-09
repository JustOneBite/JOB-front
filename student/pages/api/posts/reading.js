import { getReadingContent } from "@/DBdata";

export default function handler(req, res) {
  if (req.method === 'POST') {
      const { lesson, curriNum } = req.body;

      const content = getReadingContent(lesson);

      
      
      if(!content){
        return res.status(404).json({message:"content not found"})
      }
      
      
      // 요청 처리
      const responseData = {
          lesson,
          curriNum,
          content: content,
          message: "POST 요청이 성공적으로 처리되었습니다!",
      };

      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json(responseData);
  } else {
      // 허용되지 않은 메서드일 경우
      return res.setHeader('Allow', ['POST']).status(405).end('Method Not Allowed');
  }
}
