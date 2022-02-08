import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getCookie } from "../functions/storage"

const AuthMiddleware = ({children}: {children: JSX.Element | JSX.Element[]}) => {
    const history = useNavigate()
    
    useEffect(() => {
        if (getCookie("jwt")) return history("/admin/groups")
    }, [])

    return <>
        {children}
    </>
}

export default AuthMiddleware