import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeeService } from '../services/employeeService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatters';
import Navbar from '../components/Navbar';

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { isManagerOrAdmin } = useAuth();
    const { showToast } = useToast();
    
    useEffect(() => {
        loadEmployees();
    }, []);
    
    const loadEmployees = async () => {
        try {
            setLoading(true);
            const data = await employeeService.getAll();
            setEmployees(data);
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };
    
    const handleDelete = async (id, name) => {
        if (!window.confirm(`Supprimer ${name} ?`)) return;
        
        try {
            await employeeService.delete(id);
            showToast('Employé supprimé avec succès', 'success');
            setEmployees(prev => prev.filter(e => e.id !== id));
        } catch (err) {
            showToast(err.message, 'error');
        }
    };
    
    const filtered = employees.filter(emp =>
        emp.firstName.toLowerCase().includes(search.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(search.toLowerCase())
    );
    
    return (
        <>
            <Navbar />
            <div className="container">
                <div className="card">
                    <h1>Liste des Employés</h1>
                    
                    <div className="actions">
                        <input 
                            type="text"
                            placeholder="Rechercher..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{padding: '10px', borderRadius: '5px', border: '2px solid #ddd', width: '300px'}}
                        />
                        <Link to="/employees/new" className="btn btn-primary">
                            ➕ Ajouter
                        </Link>
                    </div>
                    
                    {loading ? (
                        <div className="loading-container"><div className="spinner"></div></div>
                    ) : filtered.length === 0 ? (
                        <p className="text-center">Aucun employé trouvé.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Prénom</th>
                                    <th>Nom</th>
                                    <th>Date naissance</th>
                                    <th>Âge</th>
                                    <th>Genre</th>
                                    <th>Titre</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(emp => (
                                    <tr key={emp.id}>
                                        <td>{emp.firstName}</td>
                                        <td>{emp.lastName}</td>
                                        <td>{formatDate(emp.birthDate)}</td>
                                        <td>{emp.age} ans</td>
                                        <td>{emp.gender}</td>
                                        <td>{emp.titleDescription}</td>
                                        <td>
                                            <Link to={`/employees/${emp.id}`} className="btn btn-sm btn-primary">
                                                Voir
                                            </Link>
                                            <Link to={`/employees/edit/${emp.id}`} className="btn btn-sm btn-success" style={{marginLeft: '5px'}}>
                                                Modifier
                                            </Link>
                                            {isManagerOrAdmin() && (
                                                <button 
                                                    onClick={() => handleDelete(emp.id, `${emp.firstName} ${emp.lastName}`)}
                                                    className="btn btn-sm btn-danger"
                                                    style={{marginLeft: '5px'}}
                                                >
                                                    Supprimer
                                                </button>
                                            )}
                                        </td>
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

