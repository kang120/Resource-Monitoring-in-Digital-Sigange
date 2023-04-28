import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginView from './views/LoginView';
import DashBoardView from './views/DashBoardView';
import ActivitiesView from './views/ActivitiesView';
import UserView from './views/UserView';
import ReportListView from './views/ReportListView';
import ReportView from './views/ReportView';

function App() {

    return (
        <Router>
            <Routes>
                <Route path='/' element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginView />} />
                <Route path="/dashboard" element={<DashBoardView />} />
                <Route path="/user_activities" element={<ActivitiesView />} />
                <Route path="/users" element={<UserView />} />
                <Route path="/report" element={<ReportListView />} />
                <Route path="/report/:id" element={<ReportView />} />
            </Routes>
        </Router>
    );
}

export default App;
