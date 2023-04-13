import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import AdminDashboard from "../components/AdminDashboard";
import UserDashboard from "../components/UserDashboard";
import useSessionStore from "../stores/sessionStore";

const DashBoardView = () => {
    const { auth, setAuth } = useSessionStore();

    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(window.sessionStorage.getItem('auth'));

        if (user == null) {
            navigate('/login')
        } else {
            setAuth(user)
        }
    }, [])

    return (
        <div>
            <Header />

            <div className="page-body">
                {
                    auth.user_type == 'admin' ?
                        <AdminDashboard /> :
                        <UserDashboard user_id={auth.user_id} />
                }
            </div>
        </div>
    )
}

export default DashBoardView;
