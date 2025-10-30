import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeSchema } from '../utils/validation';
import { employeeService } from '../services/employeeService';
import { titleService } from '../services/titleService';
import { useToast } from '../context/ToastContext';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

export default function EmployeeForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const isEditMode = !!id;
    
    const [titles, setTitles] = useState([]);
    const [loading, setLoading] = useState(isEditMode);
    
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: zodResolver(employeeSchema)
    });
    
    useEffect(() => {
        loadTitles();
        if (isEditMode) loadEmployee();
    }, [id]);
    
    const loadTitles = async () => {
        try {
            const data = await titleService.getAll();
            setTitles(data);
        } catch (err) {
            showToast(err.message, 'error');
        }
    };
    
    const loadEmployee = async () => {
        try {
            const employee = await employeeService.getById(id);
            reset({
                firstName: employee.firstName,
                lastName: employee.lastName,
                birthDate: employee.birthDate.split('T')[0],
                gender: employee.gender,
                titleId: employee.titleId
            });
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };
    
    const onSubmit = async (data) => {
        try {
            if (isEditMode) {
                await employeeService.update(id, data);
                showToast('Employé modifié avec succès', 'success');
            } else {
                await employeeService.create(data);
                showToast('Employé créé avec succès', 'success');
            }
            navigate('/employees');
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
                    <h1>{isEditMode ? 'Modifier' : 'Créer'} un employé</h1>
                    
                    <form onSubmit={handleSubmit(onSubmit)}>
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
                            <label>Date de naissance</label>
                            <input type="date" {...register('birthDate')} />
                            {errors.birthDate && <span className="error">{errors.birthDate.message}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label>Genre</label>
                            <select {...register('gender')}>
                                <option value="">Sélectionner...</option>
                                <option value="Homme">Homme</option>
                                <option value="Femme">Femme</option>
                                <option value="Autre">Autre</option>
                            </select>
                            {errors.gender && <span className="error">{errors.gender.message}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label>Titre/Poste</label>
                            <select {...register('titleId')}>
                                <option value="">Sélectionner...</option>
                                {titles.map(title => (
                                    <option key={title.id} value={title.id}>{title.description}</option>
                                ))}
                            </select>
                            {errors.titleId && <span className="error">{errors.titleId.message}</span>}
                        </div>
                        
                        <div style={{display: 'flex', gap: '10px', marginTop: '30px'}}>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                            <Link to="/employees" className="btn btn-secondary">Annuler</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

