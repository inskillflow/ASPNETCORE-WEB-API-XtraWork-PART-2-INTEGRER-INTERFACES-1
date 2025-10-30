/**
 * Context pour la gestion de l'authentification
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setLoading(false);
    }, []);
    
    const login = async (username, password) => {
        const data = await authService.login(username, password);
        setUser(data.user);
        return data;
    };
    
    const register = async (userData) => {
        const data = await authService.register(userData);
        setUser(data.user);
        return data;
    };
    
    const logout = async () => {
        await authService.logout();
        setUser(null);
    };
    
    const hasPermission = (requiredRole) => {
        if (!user) return false;
        
        const roles = { User: 1, Manager: 2, Admin: 3 };
        return (roles[user.role] || 0) >= (roles[requiredRole] || 0);
    };
    
    const value = {
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        hasPermission,
        isAdmin: () => hasPermission('Admin'),
        isManagerOrAdmin: () => hasPermission('Manager'),
        loading
    };
    
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

