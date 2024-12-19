import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Supprimer les tokens de session/local storage
        localStorage.removeItem('accessToken'); // Nom du token (remplacez par le vôtre)
        localStorage.removeItem('refreshToken');

        // Rediriger vers la page de connexion
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Barre de navigation */}
            <header className="bg-blue-600 text-white py-4 shadow-md">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Mon Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                    >
                        Déconnexion
                    </button>
                </div>
            </header>

            {/* Contenu principal */}
            <main className="container mx-auto px-4 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-2">Statistiques</h2>
                        <p className="text-gray-700">Quelques statistiques importantes ici.</p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-2">Utilisateurs</h2>
                        <p className="text-gray-700">Gère tes utilisateurs ou vois leurs infos.</p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-2">Paramètres</h2>
                        <p className="text-gray-700">Modifie les paramètres de ton application.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
