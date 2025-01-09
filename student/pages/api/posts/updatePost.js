
// 받는거 테스트 하는거임 ( 무시해도 되는 파일 )
// 여기서 DB를 업데이트 시켜줘야 되요 ( 그래야 바뀜 )
export default async function handler(req, res) {
  if (req.method === 'DELETE'){
    console.log('delete 작용')

    return res.status(200).json({ message: '글이 성공적으로 삭제된거처럼 되었습니다.'});
  }
  
  if (req.method === 'POST') {
    console.log('post 작용' , req.body)

    return res.status(200).json({ message: '글이 성공적으로 업데이트 되었습니다.'});
  }

  // POST 요청이 아닌 경우
  res.status(405).json({ message: '허용되지 않은 HTTP 메서드입니다.' });
}
