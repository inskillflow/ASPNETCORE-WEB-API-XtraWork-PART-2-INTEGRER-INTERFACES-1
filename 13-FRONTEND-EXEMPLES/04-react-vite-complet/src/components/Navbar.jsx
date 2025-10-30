import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };
    
    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="navbar-brand">XtraWork</div>
                
                {user && (
                    <div className="navbar-menu">
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/employees">Employés</Link>
                        <Link to="/titles">Titres</Link>
                        
                        <div className="user-info">
                            <span className="user-name">@{user.username}</span>
                            <span className="user-badge">{user.role}</span>
                            <button onClick={handleLogout} className="btn btn-danger btn-sm">
                                Déconnexion
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

