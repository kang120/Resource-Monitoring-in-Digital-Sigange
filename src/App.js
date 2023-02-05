import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginView from './views/LoginView';
import DashBoardView from './views/DashBoardView';
import TableView from './views/TableView';
import Overview from './views/Overview';
import { useEffect } from 'react';

function App() {

    return (
        <Router>
            <Routes>
                <Route path='/' element={<Navigate to="/login" />} />
                <Route path="login" element={<LoginView />} />
                <Route path="dashboard" element={<DashBoardView />}>
                    <Route index element={<Overview />} />
                    <Route path="table" element={<TableView />} />
                </Route>
            </Routes>
		</Router>
    );
}

export default App;
