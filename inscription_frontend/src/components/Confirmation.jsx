import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Confirmation = () => {
    const [formData, setFormData] = useState({ telephone: '', code: '' });
    const navigate = useNavigate(); // Hook pour la redirection

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/confirmation/', formData);
            alert(response.data.message);
            // Redirige vers le Dashboard après confirmation
            navigate('/dashboard');
        } catch (error) {
            alert(error.response?.data.message || "Une erreur est survenue.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Code de Confirmation</h2>
                <input 
                    type="text" 
                    name="telephone" 
                    placeholder="Téléphone" 
                    onChange={handleChange} 
                    className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required 
                />
                <input 
                    type="text" 
                    name="code" 
                    placeholder="Code de confirmation" 
                    onChange={handleChange} 
                    className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required 
                />
                <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                    Confirmer
                </button>
            </form>
        </div>
    );
};

export default Confirmation;
