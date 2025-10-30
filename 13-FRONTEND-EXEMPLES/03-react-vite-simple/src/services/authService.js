/**
 * Service d'authentification
 */

import apiClient from './api';
import config from '../config';

export const authService = {
    /**
     * Connexion utilisateur
     */
    async login(username, password) {
        const response = await apiClient.post('/auth/login', {
            username,
            password
        });
        
        const { token, user } = response.data;
        
        // Sauvegarder dans localStorage
        localStorage.setItem(config.TOKEN_KEY, token);
        localStorage.setItem(config.USER_KEY, JSON.stringify(user));
        
        return response.data;
    },
    
    /**
     * Déconnexion
     */
    async logout() {
        try {
            await apiClient.post('/auth/logout');
        } finally {
            localStorage.removeItem(config.TOKEN_KEY);
            localStorage.removeItem(config.USER_KEY);
        }
    },
    
    /**
     * Récupérer l'utilisateur actuel
     */
    getCurrentUser() {
        const userJson = localStorage.getItem(config.USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    },
    
    /**
     * Vérifier si authentifié
     */
    isAuthenticated() {
        return !!localStorage.getItem(config.TOKEN_KEY);
    }
};

