/**
 * Client API pour communiquer avec le backend
 */

/**
 * Effectue une requête HTTP avec gestion automatique du token JWT
 */
async function fetchAPI(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    // Ajouter le token JWT si disponible
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(url, {
            ...options,
            headers
        });
        
        // Gérer l'erreur 401 (token expiré ou invalide)
        if (response.status === 401) {
            clearAuthData();
            window.location.href = 'login.html';
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
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            throw new Error('Impossible de contacter le serveur. Vérifiez que l\'API est démarrée.');
        }
        throw error;
    }
}

/**
 * API Employés
 */
const EmployeeAPI = {
    /**
     * Récupère tous les employés
     */
    async getAll() {
        return await fetchAPI('/employees');
    },
    
    /**
     * Récupère un employé par ID
     */
    async getById(id) {
        return await fetchAPI(`/employees/${id}`);
    },
    
    /**
     * Crée un nouvel employé
     */
    async create(data) {
        return await fetchAPI('/employees', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    /**
     * Modifie un employé existant
     */
    async update(id, data) {
        return await fetchAPI(`/employees/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    /**
     * Supprime un employé
     */
    async delete(id) {
        return await fetchAPI(`/employees/${id}`, {
            method: 'DELETE'
        });
    }
};

/**
 * API Titres
 */
const TitleAPI = {
    /**
     * Récupère tous les titres
     */
    async getAll() {
        return await fetchAPI('/titles');
    },
    
    /**
     * Récupère un titre par ID
     */
    async getById(id) {
        return await fetchAPI(`/titles/${id}`);
    },
    
    /**
     * Crée un nouveau titre
     */
    async create(data) {
        return await fetchAPI('/titles', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    /**
     * Modifie un titre existant
     */
    async update(id, data) {
        return await fetchAPI(`/titles/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    /**
     * Supprime un titre
     */
    async delete(id) {
        return await fetchAPI(`/titles/${id}`, {
            method: 'DELETE'
        });
    }
};

