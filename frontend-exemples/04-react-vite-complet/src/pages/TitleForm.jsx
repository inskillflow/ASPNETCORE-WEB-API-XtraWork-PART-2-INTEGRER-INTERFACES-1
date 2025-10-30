import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { titleSchema } from '../utils/validation';
import { titleService } from '../services/titleService';
import { useToast } from '../context/ToastContext';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

export default function TitleForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const isEditMode = !!id;
    const [loading, setLoading] = useState(isEditMode);
    
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: zodResolver(titleSchema)
    });
    
    useEffect(() => {
        if (isEditMode) loadTitle();
    }, [id]);
    
    const loadTitle = async () => {
        try {
            const title = await titleService.getById(id);
            reset({ description: title.description });
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };
    
    const onSubmit = async (data) => {
        try {
            if (isEditMode) {
                await titleService.update(id, data);
                showToast('Titre modifié avec succès', 'success');
            } else {
                await titleService.create(data);
                showToast('Titre créé avec succès', 'success');
            }
            navigate('/titles');
        } catch (err) {
            showToast(err.message, 'error');
        }
    };
    
    if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
    
    return (
        <>
            <Navbar />
            <div className="container">
                <div className="card">
                    <h1>{isEditMode ? 'Modifier' : 'Créer'} un titre</h1>
                    
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label>Description du poste</label>
                            <input 
                                {...register('description')} 
                                placeholder="Ex: Développeur Senior, Manager RH, etc."
                            />
                            {errors.description && <span className="error">{errors.description.message}</span>}
                        </div>
                        
                        <div style={{display: 'flex', gap: '10px', marginTop: '30px'}}>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                            <Link to="/titles" className="btn btn-secondary">Annuler</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

