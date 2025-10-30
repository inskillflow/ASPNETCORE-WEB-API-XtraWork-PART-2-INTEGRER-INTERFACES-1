/**
 * Page Liste des employés
 */

import { useState, useEffect } from 'react';
import { employeeService } from '../services/employeeService';
import Navbar from '../components/Navbar';
import './Employees.css';

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    useEffect(() => {
        loadEmployees();
    }, []);
    
    const loadEmployees = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await employeeService.getAll();
            setEmployees(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    
    return (
        <>
            <Navbar />
            <div className="container">
                <div className="card">
                    <h1>Liste des Employés</h1>
                    
                    <div className="actions">
                        <button onClick={loadEmployees} className="btn btn-secondary">
                            🔄 Actualiser
                        </button>
                    </div>
                    
                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}
                    
                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Chargement des employés...</p>
                        </div>
                    ) : employees.length === 0 ? (
                        <div className="empty-state">
                            <p>Aucun employé trouvé.</p>
                        </div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Prénom</th>
                                    <th>Nom</th>
                                    <th>Date de naissance</th>
                                    <th>Âge</th>
                                    <th>Genre</th>
                                    <th>Titre/Poste</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map(employee => (
                                    <tr key={employee.id}>
                                        <td>{employee.firstName}</td>
                                        <td>{employee.lastName}</td>
                                        <td>{formatDate(employee.birthDate)}</td>
                                        <td>{employee.age} ans</td>
                                        <td>{employee.gender}</td>
                                        <td>{employee.titleDescription}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
}

