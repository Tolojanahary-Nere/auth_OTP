import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Inscription from './components/Inscription';
import Confirmation from './components/Confirmation';
import Dashboard from './components/Dashboard';
import Connexion from './components/Login';
import ResetPassword from './components/ResetPassword';
import NewPassword from './components/NewPassword';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/inscription" element={<Inscription />} />
                <Route path="/confirmation" element={<Confirmation />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/connexion" element={<Connexion />} />
                <Route path="/" element={<Connexion />} />
                <Route path="/login" element={<Connexion />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/reset-password/:uid/:token" element={<NewPassword />} />
            </Routes>
        </Router>
    );
};

export default App;
