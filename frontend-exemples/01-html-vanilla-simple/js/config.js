/**
 * Configuration de l'application
 */

// URL de base de l'API
const API_BASE_URL = 'https://localhost:7033/api';

// Clés pour le stockage local
const STORAGE_KEYS = {
    TOKEN: 'xtrawork_token',
    USER: 'xtrawork_user'
};

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_BASE_URL, STORAGE_KEYS };
}

