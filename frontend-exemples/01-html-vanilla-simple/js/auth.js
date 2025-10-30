/**
 * Gestion de l'authentification
 */

/**
 * Vérifie si l'utilisateur est connecté
 * @returns {boolean}
 */
function isAuthenticated() {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    return token !== null && token !== '';
}

/**
 * Récupère le token JWT
 * @returns {string|null}
 */
function getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

/**
 * Récupère les informations de l'utilisateur connecté
 * @returns {object|null}
 */
function getCurrentUser() {
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    return userJson ? JSON.parse(userJson) : null;
}

/**
 * Sauvegarde le token et les informations utilisateur
 * @param {string} token - Token JWT
 * @param {object} user - Informations utilisateur
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
 * @param {string} username - Nom d'utilisateur
 * @param {string} password - Mot de passe
 * @returns {Promise<object>} Données de réponse (token, user)
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
        window.location.href = 'index.html';
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

