import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "../views/admin/Login"
import Home from "../views/Home"
import AdminGroups from "../views/admin/Groups"
import AdminSliders from "../views/admin/Sliders"
import GroupEdition from "../views/admin/GroupEdition"
import AuthMiddleware from "../middlewares/auth.middleware"
import GuestMiddleware from "../middlewares/guest.middleware"
import Group from "../views/Group"

const R = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/group" element={<Group />} />

                <Route path="/admin/login" element={<GuestMiddleware>
                    <Login />
                </GuestMiddleware>} />

                <Route path="/admin/groups" element={<AuthMiddleware>
                    <AdminGroups />
                </AuthMiddleware>} />
                <Route path="/admin/groups/:id" element={<AuthMiddleware>
                    <GroupEdition />
                </AuthMiddleware>} />
                <Route path="/admin/sliders" element={<AuthMiddleware>
                    <AdminSliders />
                </AuthMiddleware>} />

            </Routes>
        </BrowserRouter>
    )
}

export default R