/**
 * Client API Axios configuré
 */

import axios from 'axios';
import config from '../config';

// Créer une instance Axios
const apiClient = axios.create({
    baseURL: config.API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Intercepteur de requête : Ajouter le token JWT
apiClient.interceptors.request.use(
    (requestConfig) => {
        const token = localStorage.getItem(config.TOKEN_KEY);
        if (token) {
            requestConfig.headers.Authorization = `Bearer ${token}`;
        }
        return requestConfig;
    },
    (error) => Promise.reject(error)
);

// Intercepteur de réponse : Gérer les erreurs
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expiré, rediriger vers login
            localStorage.removeItem(config.TOKEN_KEY);
            localStorage.removeItem(config.USER_KEY);
            window.location.href = '/login';
        }
        
        return Promise.reject({
            message: error.response?.data?.message || 'Une erreur est survenue',
            status: error.response?.status
        });
    }
);

export default apiClient;

