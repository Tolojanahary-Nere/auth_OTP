import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ConfirmResetPassword = () => {
    const { uid, token } = useParams(); // Récupérer les paramètres de l'URL
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage("Les mots de passe ne correspondent pas.");
            return;
        }
        setLoading(true);
        try {
            await axios.post("http://localhost:8000/api/reset-password-confirm/", {
                uid,
                token,
                new_password: newPassword,
            });
            setMessage("Mot de passe réinitialisé avec succès !");
            setLoading(false);
            navigate("/login");
        } catch (error) {
            setMessage(error.response?.data?.message || "Une erreur est survenue.");
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-xl font-bold mb-4 text-center">Nouveau mot de passe</h2>
                <input
                    type="password"
                    placeholder="Nouveau mot de passe"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    required
                />
                <input
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    required
                />
                <button
                    type="submit"
                    className={`w-full p-2 text-white rounded ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
                    disabled={loading}
                >
                    {loading ? "En cours..." : "Réinitialiser"}
                </button>
                {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
            </form>
        </div>
    );
};

export default ConfirmResetPassword;
