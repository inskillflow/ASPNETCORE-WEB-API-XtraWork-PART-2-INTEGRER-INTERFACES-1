/**
 * Composant principal de l'application
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Route publique */}
                    <Route path="/login" element={<Login />} />
                    
                    {/* Routes protégées */}
                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } 
                    />
                    
                    <Route 
                        path="/employees" 
                        element={
                            <ProtectedRoute>
                                <Employees />
                            </ProtectedRoute>
                        } 
                    />
                    
                    {/* Redirection par défaut */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    
                    {/* Route 404 */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;

