import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Redirect = ({to}: {to: string}) => {
    const history = useNavigate()
    
    useEffect(() => {
        history(to)
    }, [])

    return null
}

export default Redirect