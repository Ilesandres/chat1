import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../modules/api';
import '../index.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await login(email, password);
            if (response.token) {
                navigate('/chats', { replace: true });
            }
        } catch (err) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Iniciar Sesión</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Contraseña:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="login-button"
                    >
                        {loading ? 'Cargando...' : 'Entrar'}
                    </button>
                    <div className="form-footer">
                        <p>¿No tienes cuenta? <a href="/register">Regístrate</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
