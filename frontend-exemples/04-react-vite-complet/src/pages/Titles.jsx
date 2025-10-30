import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { titleService } from '../services/titleService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatters';
import Navbar from '../components/Navbar';

export default function Titles() {
    const [titles, setTitles] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAdmin, isManagerOrAdmin } = useAuth();
    const { showToast } = useToast();
    
    useEffect(() => {
        loadTitles();
    }, []);
    
    const loadTitles = async () => {
        try {
            setLoading(true);
            const data = await titleService.getAll();
            setTitles(data);
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };
    
    const handleDelete = async (id, description) => {
        if (!window.confirm(`Supprimer "${description}" ?`)) return;
        
        try {
            await titleService.delete(id);
            showToast('Titre supprimé avec succès', 'success');
            setTitles(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            showToast(err.message, 'error');
        }
    };
    
    return (
        <>
            <Navbar />
            <div className="container">
                <div className="card">
                    <h1>Liste des Titres</h1>
                    
                    <div className="actions">
                        {isAdmin() && (
                            <Link to="/titles/new" className="btn btn-primary">
                                ➕ Ajouter un titre
                            </Link>
                        )}
                    </div>
                    
                    {!isAdmin() && (
                        <div className="alert alert-info">
                            Seuls les Admins peuvent créer et supprimer des titres.
                        </div>
                    )}
                    
                    {loading ? (
                        <div className="loading-container"><div className="spinner"></div></div>
                    ) : titles.length === 0 ? (
                        <p className="text-center">Aucun titre trouvé.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Description du poste</th>
                                    <th>Date de création</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {titles.map(title => (
                                    <tr key={title.id}>
                                        <td>{title.description}</td>
                                        <td>{formatDate(title.createdAt)}</td>
                                        <td>
                                            {isManagerOrAdmin() && (
                                                <Link to={`/titles/edit/${title.id}`} className="btn btn-sm btn-success">
                                                    Modifier
                                                </Link>
                                            )}
                                            {isAdmin() && (
                                                <button 
                                                    onClick={() => handleDelete(title.id, title.description)}
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

