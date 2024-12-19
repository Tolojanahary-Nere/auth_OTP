import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const NewPassword = () => {
    const { uid, token } = useParams(); // Récupère l'UID et le token depuis l'URL
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8000/api/reset-password-confirm/`, {
                uid,
                token,
                password,
            });
            setMessage(response.data.message);
            setTimeout(() => navigate('/login'), 3000); // Redirige vers la page de connexion après 3 secondes
        } catch (error) {
            setMessage(error.response?.data?.message || "Une erreur est survenue.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md w-96"
            >
                <h2 className="text-xl font-bold mb-4 text-center">
                    Définir un nouveau mot de passe
                </h2>
                <input
                    type="password"
                    placeholder="Nouveau mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    required
                />
                <input
                    type="password"
                    placeholder="Confirmez le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    required
                />
                <button
                    type="submit"
                    className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Confirmer
                </button>
                {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
            </form>
        </div>
    );
};

export default NewPassword;
