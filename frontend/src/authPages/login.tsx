import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './auth.css';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
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
            const response = await fetch('http://localhost:5001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                setSuccessMessage(`Üdv újra, ${data.user.name}!`);
                window.setTimeout(() => {
                    navigate('/');
                }, 1800);
            } else {
                setError(data.error || 'Hibás e-mail vagy jelszó.');
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
                <h2>Bejelentkezés</h2>
                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>E-mail cím</label>
                        <input type="email" name="email" placeholder="pelda@email.com" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Jelszó</label>
                        <input type="password" name="password" placeholder="Titkos jelszó" value={formData.password} onChange={handleChange} required />
                    </div>

                    <button type="submit" className="auth-btn">Belépés</button>
                </form>

                <p className="auth-footer">
                    Még nincs fiókod? <Link to="/register">Regisztrálj most!</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
