import { Box, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import { NavigateFunction, useNavigate } from "react-router-dom"
import { getCdnUrl, request, API_URL } from "../functions/request"
import { getCookie, removeCookie } from "../functions/storage"
import "../styles/pages/home.scss"
import { GroupType } from "./admin/GroupEdition"
import { io, Socket } from "socket.io-client"

interface IProps {
    navigate: NavigateFunction
}
interface IState {
    group: GroupType | null;
    sliders: GroupType["sliders"];
    index: number
}

const Home = () => {
    const navigate = useNavigate()

    return <HomeClass navigate={navigate} />
}

class HomeClass extends React.Component<IProps, IState> {
    public navigate: NavigateFunction
    public timeout: NodeJS.Timeout | null = null
    public videoNode: HTMLVideoElement | null = null
    public socket: Socket<{
        groupChange: (id: number) => void;
        groupDelete: (id: number) => void;
    }>

    constructor(props: IProps) {
        super(props)
        this.navigate = props.navigate
        this.socket = io(API_URL, { transports : ['websocket'] })

        this.state = {
            group: null,
            sliders: [],
            index: -1
        }
    }

    public nextSlide = () => {
        let i = this.state.index + 1 === this.state.sliders.length ? 0 : this.state.index + 1
        this.setState({ index: i })

        if (this.state.sliders[i].mediaType !== "video") this.timeout = setTimeout(this.nextSlide, 10 * 1000)
    }

    componentDidMount() {
        let cookie = getCookie("group_id")
        if (!cookie) return setTimeout(() => this.navigate("/group"), 10)
        request(`/groups/${cookie}`).then(res => {
            if (res.type === "error") {
                removeCookie("group_id")
                return this.navigate("/group")
            }
            this.setState({
                group: res.group,
                sliders: res.group.sliders
            })
            this.nextSlide()
        })
        this.socket.on("groupChange", async id => {
            if (id !== this.state.group?.id) return
            let res = await request(`/groups/${cookie}`)
            if (res.type === "error") return

            this.setState({
                sliders: res.group.sliders,
                index: -1
            })
            this.nextSlide()
        })
        this.socket.on("groupDelete", id => {
            if (id !== this.state.group?.id) return
            this.props.navigate("/group")
        })
    }

    componentWillUnmount() {
        this.timeout && clearTimeout(this.timeout)
        this.socket.off("groupChange")
        this.socket.off("groupDelete")
    }

    render() {
        const slider = this.state.sliders[this.state.index]
        return !slider ? <></> : <Box sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            rowGap: 6,
            padding: theme => theme.spacing(8, 0),
        }}>
            {slider.title && <Typography sx={{
                fontSize: 64,
                fontWeight: 700
            }}>
                {slider.title}
            </Typography>}
            {slider.mediaSource && <Box sx={{
                position: "relative",
                "& img": {
                    height: "75vh"
                },
                "& video": {
                    height: "75vh",
                    width: "100vw"
                }
            }}>
                {slider.mediaType === "image" ?
                    <img src={getCdnUrl(slider.mediaSource)} />
                    : <video autoPlay muted onEnded={() => setTimeout(this.nextSlide, 5 * 1000)}>
                        <source src={getCdnUrl(slider.mediaSource)} />
                    </video>}
            </Box>}
        </Box>
    }
}
// const Home = () => {
//     const history = useNavigate()
//     const [sliders, setSliders] = useState<GroupType["sliders"]>([])
//     const [index, setIndex] = useState(-1)

//     useEffect(() => {
//         let cookie = getCookie("group_id")
//         if (!cookie) return history("/group")

//         let timeout: NodeJS.Timeout | null = null

//         const nextSlide = () => {
//             console.log(index, sliders)
//             timeout = setTimeout(() => nextSlide(), 1 * 1000)
//         }

//         request(`/groups/${cookie}`).then(res => {
//             if (res.type === "error") {
//                 removeCookie("group_id")
//                 return history("/group")
//             }
//             setSliders(res.group.sliders)
//             nextSlide()
//         })

//         return () => {
//             timeout && clearTimeout(timeout)
//         }
//     }, [])

//     const slider = sliders[index]

//     return (!slider) ? <></> : <>
//         <h1>{slider.label}</h1>
//         {slider.mediaType === "image" ? <img src={slider.mediaSource} /> : <video>
//             <source src={slider.mediaSource}></source>    
//         </video>}
//     </>
// }

export default Home