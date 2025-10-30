/**
 * Service pour la gestion des titres
 */

import apiClient from './api';

export const titleService = {
    /**
     * Récupérer tous les titres
     */
    async getAll() {
        const response = await apiClient.get('/titles');
        return response.data;
    },
    
    /**
     * Récupérer un titre par ID
     */
    async getById(id) {
        const response = await apiClient.get(`/titles/${id}`);
        return response.data;
    }
};

