import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

/**
 * Hook personnalisé pour gérer l'authentification
 */
export function useAuth() {
  const router = useRouter();
  const { user, token, isAuthenticated, login, register, logout } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    // Helpers
    isAdmin: user?.role === 'Admin',
    isManager: user?.role === 'Manager' || user?.role === 'Admin',
    isUser: !!user,
  };
}

/**
 * Hook pour protéger les pages authentifiées
 */
export function useRequireAuth(redirectTo: string = '/auth/login') {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  return { isAuthenticated };
}

/**
 * Hook pour protéger les pages nécessitant un rôle spécifique
 */
export function useRequireRole(allowedRoles: string[], redirectTo: string = '/dashboard') {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (user && !allowedRoles.includes(user.role)) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, user, allowedRoles, router, redirectTo]);

  return { user, isAuthenticated };
}

