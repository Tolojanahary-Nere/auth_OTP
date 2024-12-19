import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Inscription = () => {
    const [formData, setFormData] = useState({
        username: '',
        telephone: '',
        email: '',
        password: '',
        preference: 'sms', // Valeur par défaut pour la préférence
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/inscription/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Inscription réussie ! Veuillez entrer le code de confirmation.");
                navigate('/confirmation'); // Redirige vers la page de confirmation
            } else {
                alert("Une erreur est survenue lors de l'inscription.");
            }
        } catch (error) {
            alert("Une erreur est survenue.");
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
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
        radioGroup: {
            marginBottom: '1rem',
        },
        label: {
            marginLeft: '0.5rem',
            fontSize: '0.875rem',
        },
        buttonHover: {
            backgroundColor: '#2563eb',
        },
        link: {
            textAlign: 'center',
            marginTop: '1rem',
            fontSize: '0.875rem',
            color: '#3b82f6',
            cursor: 'pointer',
            textDecoration: 'underline',
        },
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2 style={styles.title}>Inscription</h2>
                <input
                    type="text"
                    name="username"
                    placeholder="Nom d'utilisateur"
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
                <input
                    type="text"
                    name="telephone"
                    placeholder="Téléphone"
                    onChange={handleChange}
                    style={styles.input}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Adresse email"
                    onChange={handleChange}
                    style={styles.input}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Mot de passe"
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
                <div style={styles.radioGroup}>
                    <label>
                        <input
                            type="radio"
                            name="preference"
                            value="sms"
                            checked={formData.preference === 'sms'}
                            onChange={handleChange}
                        />
                        <span style={styles.label}>Recevoir le code par SMS</span>
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="preference"
                            value="email"
                            checked={formData.preference === 'email'}
                            onChange={handleChange}
                        />
                        <span style={styles.label}>Recevoir le code par Email</span>
                    </label>
                </div>
                <button type="submit" style={styles.button}>
                    S'inscrire
                </button>
                <div style={styles.link} onClick={() => navigate('/login')}>
                    Déjà inscrit ? Se connecter
                </div>
            </form>
        </div>
    );
};

export default Inscription;
