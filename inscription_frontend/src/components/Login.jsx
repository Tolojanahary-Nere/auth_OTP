import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Importer Axios

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');  // Pour afficher les erreurs
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            // Envoi de la requête POST à l'API
            const response = await axios.post('http://localhost:8000/api/login/', {
                username: formData.username,
                password: formData.password
            });
    
            // Vérifier la réponse de l'API
            if (response.status === 200) {
                alert("Connexion réussie !");
                // Enregistrer le token dans le localStorage ou un autre gestionnaire d'état
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');  // Rediriger vers le tableau de bord
            }
    
            // Réinitialiser les champs du formulaire après la soumission réussie
            setFormData({ username: '', password: '' });
        } catch (error) {
            // Gérer les erreurs de connexion
            if (error.response) {
                setErrorMessage(error.response.data.message);  // Message d'erreur venant du backend
            } else {
                setErrorMessage("Une erreur est survenue.");
            }
    
            // Réinitialiser les champs du formulaire après l'échec de la soumission
            setFormData({ username: '', password: '' });
        }
    };
    
    const styles = {
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#f3f4f6',
        },
        form: {
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            width: '24rem',
        },
        title: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            textAlign: 'center',
        },
        input: {
            width: '100%',
            padding: '0.5rem',
            marginBottom: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
        },
        button: {
            width: '100%',
            padding: '0.5rem',
            backgroundColor: '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
        linkContainer: {
            textAlign: 'center',
            marginTop: '1rem',
            fontSize: '0.875rem',
        },
        link: {
            color: '#10b981',
            cursor: 'pointer',
            textDecoration: 'underline',
        },
        error: {
            color: 'red',
            marginBottom: '1rem',
            textAlign: 'center',
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2 style={styles.title}>Connexion</h2>
                
                {/* Afficher le message d'erreur s'il y en a */}
                {errorMessage && <div style={styles.error}>{errorMessage}</div>}

                <input
                    type="text"
                    name="username"
                    placeholder="Nom d'utilisateur"
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Mot de passe"
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
                <button type="submit" style={styles.button}>
                    Se connecter
                </button>
                <div style={styles.linkContainer}>
                    <span
                        style={styles.link}
                        onClick={() => navigate('/reset-password')}
                    >
                        Mot de passe oublié ?
                    </span>
                </div>
                <div style={styles.linkContainer}>
                    <span
                        style={styles.link}
                        onClick={() => navigate('/inscription')}
                    >
                        Pas encore inscrit ? S'inscrire
                    </span>
                </div>
            </form>
        </div>
    );
};

export default Login;
