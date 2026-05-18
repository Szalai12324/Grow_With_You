import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './auth.css';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await fetch('http://localhost:5001/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Sikeres regisztráció. Átirányítunk a bejelentkezéshez.');
                window.setTimeout(() => {
                    navigate('/login');
                }, 2200);
            } else {
                setError(data.error || 'Hiba történt a regisztráció során.');
            }
        } catch (err) {
            setError('Hálózati hiba történt.');
        }
    };

    return (
        <div className="auth-container">
            {successMessage && (
                <div className="success-toast auth-success-toast" role="status" aria-live="polite">
                    {successMessage}
                </div>
            )}

            <div className="auth-card">
                <h2>Regisztráció</h2>
                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Teljes név</label>
                        <input type="text" name="name" placeholder="Vezeték és Keresztnév" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>E-mail cím</label>
                        <input type="email" name="email" placeholder="pelda@email.com" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Jelszó</label>
                        <input type="password" name="password" placeholder="Legalább 6 karakter" value={formData.password} onChange={handleChange} required />
                    </div>

                    <button type="submit" className="auth-btn">Fiók létrehozása</button>
                </form>

                <p className="auth-footer">
                    Már van fiókod? <Link to="/login">Jelentkezz be itt!</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
