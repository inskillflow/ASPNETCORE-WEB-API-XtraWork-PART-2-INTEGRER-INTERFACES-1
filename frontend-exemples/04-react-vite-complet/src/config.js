/**
 * Configuration de l'application
 */

const config = {
    API_BASE_URL: import.meta.env.VITE_API_URL || 'https://localhost:7033/api',
    TOKEN_KEY: 'xtrawork_token',
    USER_KEY: 'xtrawork_user'
};

export default config;

