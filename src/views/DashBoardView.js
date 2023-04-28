import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import AdminDashboard from "../components/AdminDashboard";
import UserDashboard from "../components/UserDashboard";
import useSessionStore from "../stores/sessionStore";
import Alerts from "../components/Alerts";

const DashBoardView = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(window.sessionStorage.getItem('auth'));

        if (user == null) {
            navigate('/login')
        }
    }, [])

    return (
        <div>
            <Header />

            <div className="page-body">
                <Alerts />
                <AdminDashboard />
            </div>
        </div>
    )
}

export default DashBoardView;
