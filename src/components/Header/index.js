import { useNavigate } from "react-router-dom";
import './index.css'

const Header = () => {
    const navigate = useNavigate();

    const logout = () => {
        window.sessionStorage.removeItem('auth');
        navigate('/login')
    }

    return (
        <div className="navbar navbar-expand-md fixed-top navbar-dark bg-dark">
            <div className="container-fluid">
                <div className='collapse navbar-collapse'>
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item text-uppercase">
                            <a className="nav-link" href="dashboard">
                                Dashboard
                            </a>
                        </li>
                        <li className="nav-item text-uppercase">
                            <a className="nav-link" href="user_activities">
                                User Activities
                            </a>
                        </li>
                        <li className="nav-item text-uppercase">
                            <a className="nav-link" href="report">
                                Report
                            </a>
                        </li>
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item text-uppercase">
                            <a className="nav-link" href="users">
                                Users
                            </a>
                        </li>
                        <li className="nav-item text-uppercase">
                            <a className="nav-link" onClick={logout}>
                                Logout
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Header;
