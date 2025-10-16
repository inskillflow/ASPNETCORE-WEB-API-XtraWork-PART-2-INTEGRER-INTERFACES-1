import { create } from 'zustand';
import { AuthState, LoginRequest, RegisterRequest } from '@/types';
import { authService } from '@/services';

/**
 * Store Zustand pour la gestion de l'authentification
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  /**
   * Connexion utilisateur
   */
  login: async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials);
      
      set({
        user: response,
        token: response.token,
        isAuthenticated: true,
      });
    } catch (error) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  /**
   * Inscription utilisateur
   */
  register: async (data: RegisterRequest) => {
    try {
      const response = await authService.register(data);
      
      set({
        user: response,
        token: response.token,
        isAuthenticated: true,
      });
    } catch (error) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  /**
   * Déconnexion
   */
  logout: () => {
    authService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  /**
   * Rafraîchir les informations utilisateur
   */
  refreshUser: async () => {
    try {
      const user = await authService.getCurrentUser();
      const token = authService.getToken();
      
      set({
        user: {
          ...user,
          token: token || '',
          expiresAt: '',
        },
        token,
        isAuthenticated: true,
      });
    } catch (error) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  },
}));

/**
 * Hook pour initialiser l'authentification au chargement
 */
export const initializeAuth = () => {
  if (typeof window === 'undefined') return;
  
  const token = authService.getToken();
  const storedUser = authService.getStoredUser();
  
  if (token && storedUser) {
    useAuthStore.setState({
      user: storedUser,
      token,
      isAuthenticated: true,
    });
  }
};

