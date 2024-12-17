import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Inscription from './components/Inscription';
import Confirmation from './components/Confirmation';
import Dashboard from './components/Dashboard';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Inscription />} />
                <Route path="/confirmation" element={<Confirmation />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
};

export default App;
