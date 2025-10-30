import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { employeeService } from '../services/employeeService';
import { formatDate } from '../utils/formatters';
import Navbar from '../components/Navbar';

export default function EmployeeDetail() {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    useEffect(() => {
        loadEmployee();
    }, [id]);
    
    const loadEmployee = async () => {
        try {
            const data = await employeeService.getById(id);
            setEmployee(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
    if (error) return <div className="container"><div className="alert alert-error">{error}</div></div>;
    if (!employee) return null;
    
    return (
        <>
            <Navbar />
            <div className="container">
                <div className="card">
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                        <Link to="/employees" className="btn btn-secondary">← Retour</Link>
                        <Link to={`/employees/edit/${id}`} className="btn btn-success">Modifier</Link>
                    </div>
                    
                    <h1>{employee.firstName} {employee.lastName}</h1>
                    
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '30px'}}>
                        <div className="detail-item">
                            <label>Prénom</label>
                            <div>{employee.firstName}</div>
                        </div>
                        <div className="detail-item">
                            <label>Nom</label>
                            <div>{employee.lastName}</div>
                        </div>
                        <div className="detail-item">
                            <label>Date de naissance</label>
                            <div>{formatDate(employee.birthDate)}</div>
                        </div>
                        <div className="detail-item">
                            <label>Âge</label>
                            <div>{employee.age} ans</div>
                        </div>
                        <div className="detail-item">
                            <label>Genre</label>
                            <div>{employee.gender}</div>
                        </div>
                        <div className="detail-item">
                            <label>Titre/Poste</label>
                            <div>{employee.titleDescription}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

