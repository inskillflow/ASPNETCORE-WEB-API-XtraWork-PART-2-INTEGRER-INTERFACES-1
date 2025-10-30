/**
 * Page Dashboard
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { employeeService } from '../services/employeeService';
import { titleService } from '../services/titleService';
import Navbar from '../components/Navbar';
import './Dashboard.css';

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        employeeCount: 0,
        titleCount: 0
    });
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        loadStats();
    }, []);
    
    const loadStats = async () => {
        try {
            const [employees, titles] = await Promise.all([
                employeeService.getAll(),
                titleService.getAll()
            ]);
            
            setStats({
                employeeCount: employees.length,
                titleCount: titles.length
            });
        } catch (error) {
            console.error('Erreur lors du chargement des statistiques:', error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <>
            <Navbar />
            <div className="container">
                <div className="welcome-card">
                    <h2>Bienvenue, {user.firstName} {user.lastName} !</h2>
                    <p>Tableau de bord de gestion</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Employés</h3>
                        <div className="stat-value">
                            {loading ? '...' : stats.employeeCount}
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <h3>Total Titres</h3>
                        <div className="stat-value">
                            {loading ? '...' : stats.titleCount}
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <h3>Votre Rôle</h3>
                        <div className="stat-value" style={{ fontSize: '24px' }}>
                            {user.role}
                        </div>
                    </div>
                </div>

                <div className="menu-grid">
                    <Link to="/employees" className="menu-card">
                        <div className="icon">👥</div>
                        <h3>Employés</h3>
                        <p>Voir la liste des employés</p>
                    </Link>
                    
                    <div className="menu-card" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                        <div className="icon">💼</div>
                        <h3>Titres</h3>
                        <p>Voir la liste des titres</p>
                        <small style={{ color: '#999', fontSize: '12px' }}>
                            (Disponible dans version complète)
                        </small>
                    </div>
                </div>
            </div>
        </>
    );
}

