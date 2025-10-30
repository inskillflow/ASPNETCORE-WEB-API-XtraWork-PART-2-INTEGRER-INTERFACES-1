/**
 * Gestion complète de l'authentification
 */

/**
 * Vérifie si l'utilisateur est connecté
 */
function isAuthenticated() {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    return token !== null && token !== '';
}

/**
 * Récupère le token JWT
 */
function getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

/**
 * Récupère les informations de l'utilisateur connecté
 */
function getCurrentUser() {
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    return userJson ? JSON.parse(userJson) : null;
}

/**
 * Sauvegarde les données d'authentification
 */
function saveAuthData(token, user) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

/**
 * Supprime les données d'authentification
 */
function clearAuthData() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
}

/**
 * Connexion utilisateur
 */
async function login(username, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Erreur de connexion' }));
        throw new Error(error.message || 'Nom d\'utilisateur ou mot de passe incorrect');
    }

    const data = await response.json();
    saveAuthData(data.token, data.user);
    return data;
}

/**
 * Inscription d'un nouvel utilisateur
 */
async function register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Erreur d\'inscription' }));
        throw new Error(error.message || 'Impossible de créer le compte');
    }

    const data = await response.json();
    saveAuthData(data.token, data.user);
    return data;
}

/**
 * Déconnexion utilisateur
 */
async function logout() {
    const token = getToken();
    
    if (token) {
        try {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    }
    
    clearAuthData();
    window.location.href = 'index.html';
}

/**
 * Protège une page (redirection si non connecté)
 */
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

/**
 * Redirige vers le dashboard si déjà connecté
 */
function redirectIfAuthenticated() {
    if (isAuthenticated()) {
        window.location.href = 'dashboard.html';
    }
}

/**
 * Vérifie si l'utilisateur a une permission (rôle)
 */
function hasPermission(requiredRole) {
    const user = getCurrentUser();
    if (!user) return false;
    
    const roleHierarchy = {
        'User': 1,
        'Manager': 2,
        'Admin': 3
    };
    
    const userLevel = roleHierarchy[user.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;
    
    return userLevel >= requiredLevel;
}

/**
 * Vérifie si l'utilisateur est Admin
 */
function isAdmin() {
    return hasPermission('Admin');
}

/**
 * Vérifie si l'utilisateur est Manager ou Admin
 */
function isManagerOrAdmin() {
    return hasPermission('Manager');
}

