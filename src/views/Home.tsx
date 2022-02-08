import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { request } from "../functions/request"
import { getCookie, removeCookie } from "../functions/storage"
import "../styles/pages/home.scss"
import { GroupType } from "./admin/GroupEdition"

const Home = () => {
    const history = useNavigate()
    const [group, setGroup] = useState<GroupType | null>()
    const [slide, setSlide] = useState<GroupType["sliders"][number] | null>(null)
    const [index, setIndex] = useState(-1)

    let timeout: NodeJS.Timeout | null = null

    const nextSlide = () => {
        let i = index + 1 === group?.sliders.length ? 0 : index + 1
        setIndex(i)

        if (group?.sliders[i].mediaType === "image") setTimeout(nextSlide, 30 * 1000)
    }

    useEffect(() => {
        let cookie = getCookie("group_id")
        if (!cookie) return history("/group")

        request(`/groups/${cookie}`).then(res => {
            if (res.type === "error") {
                removeCookie("group_id")
                return history("/group")
            }
            setGroup(res.group)
            nextSlide()
        })
    }, [])

    // const slider = sliders[index]

    return (!group || index === -1) ? <></> : <>
        <h1>{group.sliders[index].label}</h1>
        {group.sliders[index].mediaType === "image" ? <img src={group.sliders[index].mediaSource} /> : <video>
            <source src={group.sliders[index].mediaSource}></source>    
        </video>}
    </>
}

export default Home