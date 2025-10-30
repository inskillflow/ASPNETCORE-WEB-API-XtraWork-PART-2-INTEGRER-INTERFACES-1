/**
 * Appels API vers le backend
 */

/**
 * Effectue une requête HTTP avec gestion automatique du token JWT
 * @param {string} endpoint - Endpoint API (ex: '/employees')
 * @param {object} options - Options fetch (method, body, etc.)
 * @returns {Promise<any>} Données de réponse
 */
async function fetchAPI(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Préparer les headers
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    // Ajouter le token JWT si disponible
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Effectuer la requête
    try {
        const response = await fetch(url, {
            ...options,
            headers
        });
        
        // Gérer l'erreur 401 (token expiré ou invalide)
        if (response.status === 401) {
            clearAuthData();
            window.location.href = 'index.html';
            throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        
        // Gérer les autres erreurs
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Erreur serveur' }));
            throw new Error(error.message || `Erreur ${response.status}`);
        }
        
        // Retourner les données (ou null pour 204 No Content)
        if (response.status === 204) {
            return null;
        }
        
        return await response.json();
        
    } catch (error) {
        // Erreur réseau
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            throw new Error('Impossible de contacter le serveur. Vérifiez que l\'API est démarrée (dotnet run dans XtraWork/).');
        }
        throw error;
    }
}

/**
 * Récupère tous les employés
 * @returns {Promise<Array>} Liste des employés
 */
async function getEmployees() {
    return await fetchAPI('/employees');
}

/**
 * Récupère tous les titres
 * @returns {Promise<Array>} Liste des titres
 */
async function getTitles() {
    return await fetchAPI('/titles');
}

/**
 * Récupère un employé par ID
 * @param {string} id - ID de l'employé (GUID)
 * @returns {Promise<object>} Employé
 */
async function getEmployeeById(id) {
    return await fetchAPI(`/employees/${id}`);
}

/**
 * Récupère un titre par ID
 * @param {string} id - ID du titre (GUID)
 * @returns {Promise<object>} Titre
 */
async function getTitleById(id) {
    return await fetchAPI(`/titles/${id}`);
}

