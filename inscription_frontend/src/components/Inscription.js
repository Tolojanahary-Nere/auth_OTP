import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Inscription = () => {
    const [formData, setFormData] = useState({ username: '', telephone: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/inscription/', formData);
            alert("Inscription réussie ! Veuillez entrer le code de confirmation.");
            navigate('/confirmation'); // Redirige vers la page de confirmation
        } catch (error) {
            alert(error.response?.data.message || "Une erreur est survenue.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Inscription</h2>
                <input 
                    type="text" 
                    name="username" 
                    placeholder="Nom d'utilisateur" 
                    onChange={handleChange} 
                    className="w-full p-2 mb-4 border rounded"
                    required 
                />
                <input 
                    type="text" 
                    name="telephone" 
                    placeholder="Téléphone" 
                    onChange={handleChange} 
                    className="w-full p-2 mb-4 border rounded"
                    required 
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Mot de passe" 
                    onChange={handleChange} 
                    className="w-full p-2 mb-4 border rounded"
                    required 
                />
                <button 
                    type="submit" 
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    S'inscrire
                </button>
            </form>
        </div>
    );
};

export default Inscription;
