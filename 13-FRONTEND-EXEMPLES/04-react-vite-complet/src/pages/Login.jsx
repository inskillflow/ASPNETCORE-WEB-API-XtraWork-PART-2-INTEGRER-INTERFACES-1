import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../utils/validation';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import './Auth.css';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState('');
    
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(loginSchema)
    });
    
    const onSubmit = async (data) => {
        setError('');
        try {
            await login(data.username, data.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Erreur de connexion');
        }
    };
    
    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>XtraWork</h1>
                <p className="subtitle">Connexion à l'application</p>
                
                {error && <div className="alert alert-error">{error}</div>}
                
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label>Nom d'utilisateur</label>
                        <input {...register('username')} placeholder="admin" />
                        {errors.username && <span className="error">{errors.username.message}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label>Mot de passe</label>
                        <input type="password" {...register('password')} placeholder="••••••••" />
                        {errors.password && <span className="error">{errors.password.message}</span>}
                    </div>
                    
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>
                
                <p className="text-center mt-20">
                    Pas de compte ? <Link to="/register">Créer un compte</Link>
                </p>
                
                <div className="demo-info">
                    <strong>Compte de test :</strong><br />
                    Username : <code>admin</code><br />
                    Password : <code>Admin123!</code>
                </div>
            </div>
        </div>
    );
}

