/**
 * Service pour la gestion des employés
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
    }
};

