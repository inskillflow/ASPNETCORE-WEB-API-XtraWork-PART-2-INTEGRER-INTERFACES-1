/**
 * Service pour la gestion des titres - CRUD complet
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
    },
    
    /**
     * Créer un nouveau titre
     */
    async create(data) {
        const response = await apiClient.post('/titles', data);
        return response.data;
    },
    
    /**
     * Modifier un titre existant
     */
    async update(id, data) {
        const response = await apiClient.put(`/titles/${id}`, data);
        return response.data;
    },
    
    /**
     * Supprimer un titre
     */
    async delete(id) {
        await apiClient.delete(`/titles/${id}`);
    }
};

