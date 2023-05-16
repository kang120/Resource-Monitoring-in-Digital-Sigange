import { useNavigate } from "react-router-dom";
import './index.css'
import useSettingStore from "../../stores/SettingsStore";

const Header = () => {
    const { settings } = useSettingStore();

    const navigate = useNavigate();

    const logout = () => {
        window.sessionStorage.removeItem('auth');
        navigate('/login')
    }

    const base_url = settings[`${process.env.NODE_ENV}_base_url`]

    const dashboard_url = `${base_url}/dashboard`
    const user_activities_url = `${base_url}/user_activities`
    const report_url = `${base_url}/report`

    const username = JSON.parse(window.sessionStorage.getItem('auth')).name

    return (
        <div className="navbar navbar-expand-md fixed-top navbar-dark bg-dark">
            <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#main-navbar"
                        aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className='collapse navbar-collapse' id="main-navbar">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item text-uppercase">
                            <a className={`nav-link ${window.location.pathname.split('/')[1] == 'dashboard' ? 'active' : ''}`} href={dashboard_url}>
                                Dashboard
                            </a>
                        </li>
                        <li className="nav-item text-uppercase">
                            <a className={`nav-link ${window.location.pathname.split('/')[1] == 'user_activities' ? 'active' : ''}`} href={user_activities_url}>
                                User Activities
                            </a>
                        </li>
                        <li className="nav-item text-uppercase">
                            <a className={`nav-link ${window.location.pathname.split('/')[1] == 'report' ? 'active' : ''}`} href={report_url}>
                                Report
                            </a>
                        </li>
                        <li className="nav-item text-uppercase">
                            <a className={`nav-link ${window.location.pathname.split('/')[1] == 'users' ? 'active' : ''}`} href={`${base_url}/users`}>
                                Users
                            </a>
                        </li>
                    </ul>
                    <ul className="navbar-nav ms-auto align-items-center">
                        <li className="nav-item text-light">{username}</li>
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
