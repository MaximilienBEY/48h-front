import { useEffect } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "../views/Home"

const R = () => {
    useEffect(() => {
        const scroll = () => {
            let width = window.innerWidth - document.documentElement.clientWidth
            width <= 32 && document.documentElement.style.setProperty('--scrollbar-width', `${width}px`)
        }
        window.addEventListener("resize", scroll)
        scroll()

        return () => window.removeEventListener("resize", scroll)
    }, [])

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </BrowserRouter>
    )
}

export default R