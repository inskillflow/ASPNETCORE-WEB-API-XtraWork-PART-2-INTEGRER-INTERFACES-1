import { get, post } from '@/lib/api-client';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  UserResponse 
} from '@/types';

/**
 * Service d'authentification
 */
export const authService = {
  /**
   * Connexion utilisateur
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await post<AuthResponse>('/auth/login', credentials);
    
    // Stocker le token et les infos utilisateur
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
    }
    
    return response;
  },

  /**
   * Inscription nouvel utilisateur
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await post<AuthResponse>('/auth/register', data);
    
    // Stocker le token et les infos utilisateur
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
    }
    
    return response;
  },

  /**
   * Récupérer les informations de l'utilisateur connecté
   */
  async getCurrentUser(): Promise<UserResponse> {
    return await get<UserResponse>('/auth/me');
  },

  /**
   * Valider un token JWT
   */
  async validateToken(token: string): Promise<{ isValid: boolean; timestamp: string }> {
    return await post('/auth/validate', JSON.stringify(token));
  },

  /**
   * Déconnexion
   */
  async logout(): Promise<void> {
    try {
      await post('/auth/logout');
    } finally {
      // Nettoyer le stockage local
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  },

  /**
   * Vérifier si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('token');
    return !!token;
  },

  /**
   * Récupérer le token stocké
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },

  /**
   * Récupérer l'utilisateur stocké
   */
  getStoredUser(): AuthResponse | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

