/**
 * Service pour la gestion des employés - CRUD complet
 */

import apiClient from './api';

export const employeeService = {
    /**
     * Récupérer tous les employés
     */
    async getAll() {
        const response = await apiClient.get('/employees');
        return response.data;
    },
    
    /**
     * Récupérer un employé par ID
     */
    async getById(id) {
        const response = await apiClient.get(`/employees/${id}`);
        return response.data;
    },
    
    /**
     * Créer un nouvel employé
     */
    async create(data) {
        const response = await apiClient.post('/employees', data);
        return response.data;
    },
    
    /**
     * Modifier un employé existant
     */
    async update(id, data) {
        const response = await apiClient.put(`/employees/${id}`, data);
        return response.data;
    },
    
    /**
     * Supprimer un employé
     */
    async delete(id) {
        await apiClient.delete(`/employees/${id}`);
    }
};

