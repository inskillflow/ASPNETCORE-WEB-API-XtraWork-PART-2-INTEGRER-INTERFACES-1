/**
 * Composant principal de l'application
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EmployeeForm from './pages/EmployeeForm';
import EmployeeDetail from './pages/EmployeeDetail';
import Titles from './pages/Titles';
import TitleForm from './pages/TitleForm';

function App() {
    return (
        <AuthProvider>
            <ToastProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Routes publiques */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        
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
                        
                        <Route 
                            path="/employees/new" 
                            element={
                                <ProtectedRoute>
                                    <EmployeeForm />
                                </ProtectedRoute>
                            } 
                        />
                        
                        <Route 
                            path="/employees/edit/:id" 
                            element={
                                <ProtectedRoute>
                                    <EmployeeForm />
                                </ProtectedRoute>
                            } 
                        />
                        
                        <Route 
                            path="/employees/:id" 
                            element={
                                <ProtectedRoute>
                                    <EmployeeDetail />
                                </ProtectedRoute>
                            } 
                        />
                        
                        <Route 
                            path="/titles" 
                            element={
                                <ProtectedRoute>
                                    <Titles />
                                </ProtectedRoute>
                            } 
                        />
                        
                        <Route 
                            path="/titles/new" 
                            element={
                                <ProtectedRoute>
                                    <TitleForm />
                                </ProtectedRoute>
                            } 
                        />
                        
                        <Route 
                            path="/titles/edit/:id" 
                            element={
                                <ProtectedRoute>
                                    <TitleForm />
                                </ProtectedRoute>
                            } 
                        />
                        
                        {/* Redirection par défaut */}
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </BrowserRouter>
            </ToastProvider>
        </AuthProvider>
    );
}

export default App;

