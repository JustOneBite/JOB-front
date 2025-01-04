export default function handler(req, res) {

    const posts = {
        title: "궁금증",
        url : "",
        paragraph: ["it's","not","the","years","in","your","life","that","count.","It's", "the","life","in","your","years."],
        length : 15,
        offset : [2, 3, 10, 11]
    }

    const info = {
        title : 'Listening',
        type : 1,
        textBook : 'grammar Info',
        lesson : 3,
        date : "2024.1.1",
    }

    // console.log("여기가 서버임 ㅋ",  posts)

    if(req.method === 'POST'){
        res.setHeader('Cashe-Controller', 'no-store')
        return res.status(200).json(info)
    }else{
        res.setHeader('Cashe-Controller', 'no-store')
        return res.status(200).json(posts)
    }

}