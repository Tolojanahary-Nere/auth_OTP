import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Indicateur de chargement
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const response = await axios.post(`http://localhost:8000/api/reset-password/`, { email });
            setMessage(response.data.message);
            setLoading(false);
        } catch (error) {
            setMessage(error.response?.data?.message || "Une erreur est survenue.");
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md w-96"
            >
                <h2 className="text-xl font-bold mb-4 text-center">
                    Réinitialiser le mot de passe
                </h2>
                <input
                    type="email"
                    placeholder="Entrez votre email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    required
                />
                <button
                    type="submit"
                    className={`w-full p-2 text-white rounded ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
                    disabled={loading}
                >
                    {loading ? "Envoi en cours..." : "Envoyer le lien"}
                </button>
                {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
            </form>
        </div>
    );
};

export default ResetPassword;
