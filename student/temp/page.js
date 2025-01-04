'use client'

import {useState, useEffect} from 'react'
import { FaLongArrowAltLeft } from "react-icons/fa";
import {useRouter} from 'next/navigation'

export default function paragraph(){
    
    const [listeningParaInfo, setListeningParaInfo] = useState({title : '', type: '',textBook: '',lesson: '', data: ''})
    let router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await fetch('/api/posts/data', {
                    method : 'POST',
                    // headers: {
                        //                         'Content-Type': 'application/json',
                        //                     },
                        //                     body: JSON.stringify({
                        //                         title: "youtube"
                        //                     }),
                        //                     credentials: 'include'
                })
                
                if(!response.ok){
                    throw new Error("Network response was not ok.")
                }

                const result = await response.json()
                setListeningParaInfo(result)

            } catch(err){
                console.error('Error fetching data:', err);
            }

        }

        fetchData()

    }, [])

    const routerBack = () => {
        return router.back()
    }

    const testType = (type) => {
        if(type === 0){
            return "문장"
        }
        return "문단"
    }

    return (
        <div>
            <FaLongArrowAltLeft onClick={routerBack} />
            <div>
                <h4>{listeningParaInfo.title} ({testType(listeningParaInfo.type)})</h4>
                <p>{listeningParaInfo.textBook}</p>
                <p>레슨: {listeningParaInfo.lesson}</p>
                <h4>{listeningParaInfo.date}</h4>
                <button>학습 시작하기</button>
                <Link href={'/listeningProblems/' + problem[i]._id}><button>학습 시작하기</button></Link>
            </div>
        </div>
    )
}
