import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiError } from '@/types';

/**
 * Configuration de base pour l'API
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7033/api';

/**
 * Instance Axios configurée
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  // Désactiver la vérification SSL en développement
  httpsAgent: process.env.NODE_ENV === 'development' ? {
    rejectUnauthorized: false,
  } : undefined,
});

/**
 * Intercepteur de requête pour ajouter le token JWT
 */
apiClient.interceptors.request.use(
  (config) => {
    // Récupérer le token depuis le localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Intercepteur de réponse pour gérer les erreurs
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    // Gestion des erreurs
    if (error.response) {
      // Erreur avec réponse du serveur
      const apiError: ApiError = {
        message: error.response.data?.message || 'Une erreur est survenue',
        statusCode: error.response.status,
        errors: error.response.data?.errors,
      };

      // Si 401, rediriger vers login
      if (error.response.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      }

      return Promise.reject(apiError);
    } else if (error.request) {
      // Erreur réseau (pas de réponse)
      return Promise.reject({
        message: 'Impossible de contacter le serveur. Vérifiez votre connexion.',
        statusCode: 0,
      });
    } else {
      // Autre erreur
      return Promise.reject({
        message: error.message || 'Une erreur inattendue est survenue',
        statusCode: 0,
      });
    }
  }
);

/**
 * Helper pour les requêtes GET
 */
export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.get<T>(url, config);
  return response.data;
}

/**
 * Helper pour les requêtes POST
 */
export async function post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
}

/**
 * Helper pour les requêtes PUT
 */
export async function put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.put<T>(url, data, config);
  return response.data;
}

/**
 * Helper pour les requêtes DELETE
 */
export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
}

export default apiClient;

