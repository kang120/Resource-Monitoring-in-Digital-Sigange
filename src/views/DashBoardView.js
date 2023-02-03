import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "../components/AdminDashboard.js";
import UserDashboard from "../components/UserDashboard.js/index.js";
import useSessionStore from "../stores/sessionStore";

const DashBoardView = () => {
    const { auth, setAuth } = useSessionStore();

    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(window.sessionStorage.getItem('auth'));

        if(user == null){
            navigate('/login')
        }else{
            setAuth(user)
        }
    }, [])

    const logout = () => {
        window.sessionStorage.removeItem('auth');
        navigate('/login')
    }

    return (
        <div>
            <div className="navbar navbar-expand-md fixed-top navbar-dark bg-dark">
                <div className="container-fluid">
                    <div className='collapse navbar-collapse'>
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item text-uppercase">
                                <a className="nav-link">
                                    Dashboard
                                </a>
                            </li>
                            <li className="nav-item text-uppercase">
                                <a className="nav-link">
                                    Layouts
                                </a>
                            </li>
                            <li className="nav-item text-uppercase">
                                <a className="nav-link">
                                    Devices
                                </a>
                            </li>
                            <li className="nav-item text-uppercase">
                                <a className="nav-link">
                                    Publish
                                </a>
                            </li>
                            <li className="nav-item text-uppercase">
                                <a className="nav-link">
                                    Devices
                                </a>
                            </li>
                            <li className="nav-item text-uppercase">
                                <a className="nav-link">
                                    Learn
                                </a>
                            </li>
                        </ul>
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item ms-auto text-uppercase">
                                <a className="nav-link" onClick={logout}>
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

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
