/**
 * Fonctions utilitaires
 */

/**
 * Formate une date en format français
 * @param {string} dateString - Date ISO format
 * @returns {string} Date formatée
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Formate une date pour un input de type date
 * @param {string} dateString - Date ISO format
 * @returns {string} Date format YYYY-MM-DD
 */
function formatDateForInput(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

/**
 * Calcule l'âge à partir d'une date de naissance
 * @param {string} birthDateString - Date de naissance
 * @returns {number} Âge en années
 */
function calculateAge(birthDateString) {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

/**
 * Affiche un message toast (notification)
 * @param {string} message - Message à afficher
 * @param {string} type - Type de message (success, error, info)
 */
function showToast(message, type = 'success') {
    // Créer l'élément toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Ajouter le style inline
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    // Couleur selon le type
    if (type === 'success') {
        toast.style.background = '#48bb78';
    } else if (type === 'error') {
        toast.style.background = '#e74c3c';
    } else if (type === 'info') {
        toast.style.background = '#3498db';
    }
    
    // Ajouter au body
    document.body.appendChild(toast);
    
    // Retirer après 3 secondes
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

/**
 * Affiche une confirmation avant suppression
 * @param {string} itemName - Nom de l'élément à supprimer
 * @returns {boolean} True si confirmé
 */
function confirmDelete(itemName) {
    return confirm(`Êtes-vous sûr de vouloir supprimer "${itemName}" ?\n\nCette action est irréversible.`);
}

/**
 * Affiche un message d'erreur dans un élément
 * @param {string} elementId - ID de l'élément
 * @param {string} message - Message d'erreur
 */
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.classList.remove('hidden');
    }
}

/**
 * Cache un message d'erreur
 * @param {string} elementId - ID de l'élément
 */
function hideError(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('hidden');
    }
}

/**
 * Récupère les paramètres de l'URL
 * @param {string} paramName - Nom du paramètre
 * @returns {string|null} Valeur du paramètre
 */
function getUrlParameter(paramName) {
    const params = new URLSearchParams(window.location.search);
    return params.get(paramName);
}

/**
 * Encode du HTML pour éviter les injections XSS
 * @param {string} str - Chaîne à encoder
 * @returns {string} Chaîne encodée
 */
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Valide une adresse email
 * @param {string} email - Email à valider
 * @returns {boolean} True si valide
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Affiche/Cache un élément
 * @param {string} elementId - ID de l'élément
 * @param {boolean} show - True pour afficher, false pour cacher
 */
function toggleElement(elementId, show) {
    const element = document.getElementById(elementId);
    if (element) {
        if (show) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    }
}

/**
 * Désactive/Active un bouton
 * @param {string} buttonId - ID du bouton
 * @param {boolean} disabled - True pour désactiver
 * @param {string} loadingText - Texte pendant le chargement
 */
function setButtonLoading(buttonId, disabled, loadingText = 'Chargement...') {
    const button = document.getElementById(buttonId);
    if (button) {
        button.disabled = disabled;
        if (disabled) {
            button.dataset.originalText = button.textContent;
            button.innerHTML = `<span class="loading"></span> ${loadingText}`;
        } else {
            button.textContent = button.dataset.originalText || 'Soumettre';
        }
    }
}

// Ajouter les animations CSS pour les toasts
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

