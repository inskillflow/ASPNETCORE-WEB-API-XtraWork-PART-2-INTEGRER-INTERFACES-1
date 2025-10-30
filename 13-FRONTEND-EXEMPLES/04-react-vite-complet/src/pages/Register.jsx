import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../utils/validation';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '../context/ToastContext';
import './Auth.css';

export default function Register() {
    const navigate = useNavigate();
    const { register: registerUser } = useAuth();
    const { showToast } = useToast();
    const [error, setError] = useState('');
    
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(registerSchema)
    });
    
    const onSubmit = async (data) => {
        setError('');
        try {
            await registerUser(data);
            showToast('Compte créé avec succès !', 'success');
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Erreur lors de la création du compte');
        }
    };
    
    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Créer un compte</h1>
                <p className="subtitle">Inscrivez-vous pour accéder à XtraWork</p>
                
                {error && <div className="alert alert-error">{error}</div>}
                
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label>Nom d'utilisateur</label>
                        <input {...register('username')} />
                        {errors.username && <span className="error">{errors.username.message}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" {...register('email')} />
                        {errors.email && <span className="error">{errors.email.message}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label>Prénom</label>
                        <input {...register('firstName')} />
                        {errors.firstName && <span className="error">{errors.firstName.message}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label>Nom</label>
                        <input {...register('lastName')} />
                        {errors.lastName && <span className="error">{errors.lastName.message}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label>Mot de passe</label>
                        <input type="password" {...register('password')} />
                        {errors.password && <span className="error">{errors.password.message}</span>}
                    </div>
                    
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Création...' : 'Créer mon compte'}
                    </button>
                </form>
                
                <p className="text-center mt-20">
                    Déjà un compte ? <Link to="/login">Se connecter</Link>
                </p>
            </div>
        </div>
    );
}

