# HTML/CSS/JavaScript Vanilla - Frontend pour API ASP.NET Core

## Table des matières

1. [Introduction](#introduction)
2. [Avantages et inconvénients](#avantages-et-inconvénients)
3. [Prérequis](#prérequis)
4. [Structure du projet](#structure-du-projet)
5. [Configuration](#configuration)
6. [Authentification JWT](#authentification-jwt)
7. [Communication avec l'API](#communication-avec-lapi)
8. [Exemple complet : Page de login](#exemple-complet--page-de-login)
9. [Exemple complet : Liste des employés](#exemple-complet--liste-des-employés)
10. [Exemple complet : Formulaire de création](#exemple-complet--formulaire-de-création)
11. [Gestion des erreurs](#gestion-des-erreurs)
12. [Conclusion](#conclusion)

---

## Introduction

HTML/CSS/JavaScript Vanilla signifie créer un frontend **sans aucun framework ni bibliothèque**. Seulement les technologies natives du navigateur :
- HTML pour la structure
- CSS pour le style
- JavaScript pur pour l'interactivité

### Quand utiliser cette approche

**Idéal pour** :
- Apprendre les fondamentaux du web
- Comprendre comment fonctionnent les requêtes HTTP
- Prototypes rapides et simples
- Applications très légères
- Comprendre ce que font les frameworks en arrière-plan

**Pas idéal pour** :
- Applications complexes avec beaucoup d'état
- Projets nécessitant beaucoup de réutilisation de code
- Applications avec routing complexe
- Projets de grande envergure

---

## Avantages et inconvénients

### Avantages

**Performance**
- Aucune bibliothèque à télécharger
- Chargement instantané
- Pas de build process

**Apprentissage**
- Comprendre les bases du web
- Pas de magie de framework
- Total contrôle

**Simplicité**
- Pas de configuration
- Pas de dépendances
- Pas de compilation

**Débogage**
- Code direct et visible
- Pas d'abstraction
- DevTools natifs

### Inconvénients

**Productivité**
- Plus de code à écrire
- Pas de composants réutilisables
- Gestion manuelle du DOM

**Maintenabilité**
- Code peut devenir verbeux
- Pas de structure imposée
- Duplication de code

**Fonctionnalités**
- Pas de routing intégré
- Pas de state management
- Pas de templating avancé

---

## Prérequis

### Connaissances requises

- HTML de base (balises, attributs, formulaires)
- CSS de base (sélecteurs, propriétés, Flexbox)
- JavaScript (variables, fonctions, événements, Promises)
- Concepts HTTP (GET, POST, headers, status codes)
- JSON (structure et manipulation)

### Outils nécessaires

- Un éditeur de texte (VS Code recommandé)
- Un navigateur moderne (Chrome, Firefox, Edge)
- L'API XtraWork en cours d'exécution (`dotnet run` dans XtraWork/)

**Aucune installation npm, aucun package, aucune compilation !**

---

## Structure du projet

```
frontend-vanilla/
├── index.html              # Page d'accueil
├── login.html              # Page de connexion
├── dashboard.html          # Dashboard après connexion
├── employees.html          # Liste des employés
├── employee-form.html      # Formulaire création/modification
├── css/
│   └── style.css          # Styles globaux
└── js/
    ├── config.js          # Configuration (URL API)
    ├── auth.js            # Gestion authentification
    ├── api.js             # Client API
    ├── employees.js       # Logique employés
    └── utils.js           # Fonctions utilitaires
```

---

## Configuration

### 1. Créer le dossier du projet

```bash
mkdir frontend-vanilla
cd frontend-vanilla
mkdir css
mkdir js
```

### 2. Fichier de configuration (js/config.js)

```javascript
// Configuration de l'application
const CONFIG = {
    API_BASE_URL: 'https://localhost:7033/api',
    TOKEN_KEY: 'xtrawork_token',
    USER_KEY: 'xtrawork_user'
};

// Permettre les certificats auto-signés en développement
// Note : En production, utiliser de vrais certificats SSL
if (window.location.hostname === 'localhost') {
    console.warn('Mode développement : certificat SSL auto-signé accepté');
}
```

### 3. Styles de base (css/style.css)

```css
/* Reset et styles de base */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f5f5f5;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

/* Navigation */
.navbar {
    background-color: #2c3e50;
    color: white;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.navbar-brand {
    font-size: 1.5rem;
    font-weight: bold;
}

.navbar-menu {
    display: flex;
    gap: 1rem;
}

.navbar-menu a {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.3s;
}

.navbar-menu a:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

/* Boutons */
.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s;
}

.btn-primary {
    background-color: #3498db;
    color: white;
}

.btn-primary:hover {
    background-color: #2980b9;
}

.btn-danger {
    background-color: #e74c3c;
    color: white;
}

.btn-danger:hover {
    background-color: #c0392b;
}

/* Formulaires */
.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.form-control {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

.form-control:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

/* Cartes */
.card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-bottom: 20px;
}

/* Messages */
.alert {
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
}

.alert-error {
    background-color: #fee;
    border: 1px solid #fcc;
    color: #c33;
}

.alert-success {
    background-color: #efe;
    border: 1px solid #cfc;
    color: #3c3;
}

/* Loading spinner */
.loading {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* Table */
table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
}

table th,
table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

table th {
    background-color: #f8f9fa;
    font-weight: 600;
}

table tbody tr:hover {
    background-color: #f8f9fa;
}

/* Utilitaires */
.hidden {
    display: none;
}

.text-center {
    text-align: center;
}

.mt-20 {
    margin-top: 20px;
}

.mb-20 {
    margin-bottom: 20px;
}
```

---

## Authentification JWT

### Fichier : js/auth.js

```javascript
// Gestion de l'authentification

/**
 * Vérifie si l'utilisateur est connecté
 */
function isAuthenticated() {
    const token = localStorage.getItem(CONFIG.TOKEN_KEY);
    return token !== null;
}

/**
 * Récupère le token JWT
 */
function getToken() {
    return localStorage.getItem(CONFIG.TOKEN_KEY);
}

/**
 * Récupère les informations de l'utilisateur connecté
 */
function getCurrentUser() {
    const userJson = localStorage.getItem(CONFIG.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
}

/**
 * Sauvegarde le token et les infos utilisateur
 */
function saveAuthData(token, user) {
    localStorage.setItem(CONFIG.TOKEN_KEY, token);
    localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(user));
}

/**
 * Supprime les données d'authentification
 */
function clearAuthData() {
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.USER_KEY);
}

/**
 * Connexion utilisateur
 */
async function login(username, password) {
    const response = await fetch(`${CONFIG.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur de connexion');
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
            await fetch(`${CONFIG.API_BASE_URL}/auth/logout`, {
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
    window.location.href = 'login.html';
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
```

---

## Communication avec l'API

### Fichier : js/api.js

```javascript
// Client API pour communiquer avec le backend

/**
 * Effectue une requête HTTP avec gestion des erreurs
 */
async function fetchAPI(endpoint, options = {}) {
    const url = `${CONFIG.API_BASE_URL}${endpoint}`;
    
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
        
        // Gérer l'erreur 401 (non autorisé)
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
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            throw new Error('Impossible de contacter le serveur. Vérifiez que l\'API est en cours d\'exécution.');
        }
        throw error;
    }
}

/**
 * Méthodes HTTP simplifiées
 */
const API = {
    /**
     * GET - Récupérer des données
     */
    get: (endpoint) => fetchAPI(endpoint, { method: 'GET' }),
    
    /**
     * POST - Créer des données
     */
    post: (endpoint, data) => fetchAPI(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    
    /**
     * PUT - Modifier des données
     */
    put: (endpoint, data) => fetchAPI(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    
    /**
     * DELETE - Supprimer des données
     */
    delete: (endpoint) => fetchAPI(endpoint, { method: 'DELETE' })
};

// Exports pour utilisation dans d'autres fichiers
const EmployeeAPI = {
    getAll: () => API.get('/employees'),
    getById: (id) => API.get(`/employees/${id}`),
    create: (data) => API.post('/employees', data),
    update: (id, data) => API.put(`/employees/${id}`, data),
    delete: (id) => API.delete(`/employees/${id}`)
};

const TitleAPI = {
    getAll: () => API.get('/titles'),
    getById: (id) => API.get(`/titles/${id}`),
    create: (data) => API.post('/titles', data),
    update: (id, data) => API.put(`/titles/${id}`, data),
    delete: (id) => API.delete(`/titles/${id}`)
};
```

---

## Exemple complet : Page de login

### Fichier : login.html

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion - XtraWork</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        .login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .login-card {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            width: 100%;
            max-width: 400px;
        }
        
        .login-card h1 {
            text-align: center;
            margin-bottom: 30px;
            color: #2c3e50;
        }
        
        .demo-info {
            background-color: #e3f2fd;
            border: 1px solid #90caf9;
            border-radius: 4px;
            padding: 10px;
            margin-top: 20px;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-card">
            <h1>Connexion XtraWork</h1>
            
            <!-- Message d'erreur -->
            <div id="error-message" class="alert alert-error hidden"></div>
            
            <!-- Formulaire de connexion -->
            <form id="login-form">
                <div class="form-group">
                    <label for="username">Nom d'utilisateur</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        class="form-control" 
                        required
                        autocomplete="username"
                    >
                </div>
                
                <div class="form-group">
                    <label for="password">Mot de passe</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        class="form-control" 
                        required
                        autocomplete="current-password"
                    >
                </div>
                
                <button type="submit" class="btn btn-primary" style="width: 100%;" id="submit-btn">
                    Se connecter
                </button>
            </form>
            
            <!-- Info compte de démo -->
            <div class="demo-info">
                <strong>Compte de test :</strong><br>
                Username : admin<br>
                Password : Admin123!
            </div>
        </div>
    </div>
    
    <!-- Scripts -->
    <script src="js/config.js"></script>
    <script src="js/auth.js"></script>
    <script>
        // Rediriger si déjà connecté
        redirectIfAuthenticated();
        
        // Récupérer les éléments du DOM
        const form = document.getElementById('login-form');
        const errorMessage = document.getElementById('error-message');
        const submitBtn = document.getElementById('submit-btn');
        
        // Gérer la soumission du formulaire
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Récupérer les valeurs
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Cacher le message d'erreur
            errorMessage.classList.add('hidden');
            
            // Désactiver le bouton et afficher le loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading"></span> Connexion...';
            
            try {
                // Appeler la fonction de login
                await login(username, password);
                
                // Rediriger vers le dashboard
                window.location.href = 'dashboard.html';
                
            } catch (error) {
                // Afficher l'erreur
                errorMessage.textContent = error.message;
                errorMessage.classList.remove('hidden');
                
                // Réactiver le bouton
                submitBtn.disabled = false;
                submitBtn.textContent = 'Se connecter';
            }
        });
    </script>
</body>
</html>
```

---

## Exemple complet : Liste des employés

### Fichier : employees.html

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employés - XtraWork</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="navbar-brand">XtraWork</div>
        <div class="navbar-menu">
            <a href="dashboard.html">Dashboard</a>
            <a href="employees.html">Employés</a>
            <a href="#" onclick="logout(); return false;">Déconnexion</a>
        </div>
    </nav>
    
    <!-- Contenu principal -->
    <div class="container">
        <div class="card">
            <h1>Liste des employés</h1>
            
            <!-- Message d'erreur -->
            <div id="error-message" class="alert alert-error hidden"></div>
            
            <!-- Message de succès -->
            <div id="success-message" class="alert alert-success hidden"></div>
            
            <!-- Bouton ajouter -->
            <div class="mb-20">
                <a href="employee-form.html" class="btn btn-primary">
                    Ajouter un employé
                </a>
            </div>
            
            <!-- État de chargement -->
            <div id="loading" class="text-center">
                <div class="loading" style="width: 40px; height: 40px;"></div>
                <p>Chargement des employés...</p>
            </div>
            
            <!-- Table des employés -->
            <div id="employees-table" class="hidden">
                <table>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Date de naissance</th>
                            <th>Genre</th>
                            <th>Titre</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="employees-tbody">
                        <!-- Les lignes seront ajoutées dynamiquement -->
                    </tbody>
                </table>
            </div>
            
            <!-- Message si aucun employé -->
            <div id="no-employees" class="hidden text-center">
                <p>Aucun employé trouvé.</p>
            </div>
        </div>
    </div>
    
    <!-- Scripts -->
    <script src="js/config.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/api.js"></script>
    <script>
        // Protéger la page
        requireAuth();
        
        // Récupérer les éléments du DOM
        const loading = document.getElementById('loading');
        const employeesTable = document.getElementById('employees-table');
        const employeesTbody = document.getElementById('employees-tbody');
        const noEmployees = document.getElementById('no-employees');
        const errorMessage = document.getElementById('error-message');
        const successMessage = document.getElementById('success-message');
        
        /**
         * Formate une date en format français
         */
        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR');
        }
        
        /**
         * Charge et affiche les employés
         */
        async function loadEmployees() {
            try {
                // Afficher le loading
                loading.classList.remove('hidden');
                employeesTable.classList.add('hidden');
                noEmployees.classList.add('hidden');
                errorMessage.classList.add('hidden');
                
                // Récupérer les employés depuis l'API
                const employees = await EmployeeAPI.getAll();
                
                // Cacher le loading
                loading.classList.add('hidden');
                
                // Vérifier s'il y a des employés
                if (employees.length === 0) {
                    noEmployees.classList.remove('hidden');
                    return;
                }
                
                // Afficher la table
                employeesTable.classList.remove('hidden');
                
                // Vider le tbody
                employeesTbody.innerHTML = '';
                
                // Ajouter chaque employé
                employees.forEach(employee => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${employee.lastName}</td>
                        <td>${employee.firstName}</td>
                        <td>${formatDate(employee.birthDate)}</td>
                        <td>${employee.gender}</td>
                        <td>${employee.titleDescription}</td>
                        <td>
                            <button 
                                onclick="viewEmployee('${employee.id}')" 
                                class="btn btn-primary"
                                style="padding: 5px 10px; margin-right: 5px;"
                            >
                                Voir
                            </button>
                            <button 
                                onclick="deleteEmployee('${employee.id}', '${employee.firstName} ${employee.lastName}')" 
                                class="btn btn-danger"
                                style="padding: 5px 10px;"
                            >
                                Supprimer
                            </button>
                        </td>
                    `;
                    employeesTbody.appendChild(row);
                });
                
            } catch (error) {
                // Afficher l'erreur
                loading.classList.add('hidden');
                errorMessage.textContent = error.message;
                errorMessage.classList.remove('hidden');
            }
        }
        
        /**
         * Voir les détails d'un employé
         */
        function viewEmployee(id) {
            window.location.href = `employee-details.html?id=${id}`;
        }
        
        /**
         * Supprimer un employé
         */
        async function deleteEmployee(id, name) {
            if (!confirm(`Êtes-vous sûr de vouloir supprimer ${name} ?`)) {
                return;
            }
            
            try {
                await EmployeeAPI.delete(id);
                
                // Afficher le message de succès
                successMessage.textContent = `${name} supprimé avec succès.`;
                successMessage.classList.remove('hidden');
                
                // Recharger la liste
                setTimeout(() => {
                    successMessage.classList.add('hidden');
                    loadEmployees();
                }, 2000);
                
            } catch (error) {
                errorMessage.textContent = error.message;
                errorMessage.classList.remove('hidden');
            }
        }
        
        // Charger les employés au chargement de la page
        loadEmployees();
    </script>
</body>
</html>
```

---

## Exemple complet : Formulaire de création

### Fichier : employee-form.html

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouvel employé - XtraWork</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="navbar-brand">XtraWork</div>
        <div class="navbar-menu">
            <a href="dashboard.html">Dashboard</a>
            <a href="employees.html">Employés</a>
            <a href="#" onclick="logout(); return false;">Déconnexion</a>
        </div>
    </nav>
    
    <!-- Contenu principal -->
    <div class="container">
        <div class="card">
            <h1>Nouvel employé</h1>
            
            <!-- Message d'erreur -->
            <div id="error-message" class="alert alert-error hidden"></div>
            
            <!-- Formulaire -->
            <form id="employee-form">
                <div class="form-group">
                    <label for="firstName">Prénom *</label>
                    <input 
                        type="text" 
                        id="firstName" 
                        name="firstName" 
                        class="form-control" 
                        required
                        maxlength="50"
                    >
                </div>
                
                <div class="form-group">
                    <label for="lastName">Nom *</label>
                    <input 
                        type="text" 
                        id="lastName" 
                        name="lastName" 
                        class="form-control" 
                        required
                        maxlength="50"
                    >
                </div>
                
                <div class="form-group">
                    <label for="birthDate">Date de naissance *</label>
                    <input 
                        type="date" 
                        id="birthDate" 
                        name="birthDate" 
                        class="form-control" 
                        required
                    >
                </div>
                
                <div class="form-group">
                    <label for="gender">Genre *</label>
                    <select 
                        id="gender" 
                        name="gender" 
                        class="form-control" 
                        required
                    >
                        <option value="">Sélectionner...</option>
                        <option value="Homme">Homme</option>
                        <option value="Femme">Femme</option>
                        <option value="Autre">Autre</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="titleId">Titre *</label>
                    <select 
                        id="titleId" 
                        name="titleId" 
                        class="form-control" 
                        required
                    >
                        <option value="">Chargement...</option>
                    </select>
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button type="submit" class="btn btn-primary" id="submit-btn">
                        Créer l'employé
                    </button>
                    <a href="employees.html" class="btn" style="background-color: #95a5a6; color: white;">
                        Annuler
                    </a>
                </div>
            </form>
        </div>
    </div>
    
    <!-- Scripts -->
    <script src="js/config.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/api.js"></script>
    <script>
        // Protéger la page
        requireAuth();
        
        // Récupérer les éléments du DOM
        const form = document.getElementById('employee-form');
        const errorMessage = document.getElementById('error-message');
        const submitBtn = document.getElementById('submit-btn');
        const titleSelect = document.getElementById('titleId');
        
        /**
         * Charge la liste des titres
         */
        async function loadTitles() {
            try {
                const titles = await TitleAPI.getAll();
                
                // Vider le select
                titleSelect.innerHTML = '<option value="">Sélectionner un titre...</option>';
                
                // Ajouter chaque titre
                titles.forEach(title => {
                    const option = document.createElement('option');
                    option.value = title.id;
                    option.textContent = title.description;
                    titleSelect.appendChild(option);
                });
                
            } catch (error) {
                titleSelect.innerHTML = '<option value="">Erreur de chargement</option>';
                errorMessage.textContent = 'Impossible de charger les titres: ' + error.message;
                errorMessage.classList.remove('hidden');
            }
        }
        
        /**
         * Valide le formulaire
         */
        function validateForm(data) {
            const errors = [];
            
            if (!data.firstName || data.firstName.trim().length === 0) {
                errors.push('Le prénom est requis');
            }
            
            if (!data.lastName || data.lastName.trim().length === 0) {
                errors.push('Le nom est requis');
            }
            
            if (!data.birthDate) {
                errors.push('La date de naissance est requise');
            }
            
            if (!data.gender) {
                errors.push('Le genre est requis');
            }
            
            if (!data.titleId) {
                errors.push('Le titre est requis');
            }
            
            return errors;
        }
        
        /**
         * Gère la soumission du formulaire
         */
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Récupérer les données du formulaire
            const formData = new FormData(form);
            const data = {
                firstName: formData.get('firstName').trim(),
                lastName: formData.get('lastName').trim(),
                birthDate: formData.get('birthDate'),
                gender: formData.get('gender'),
                titleId: formData.get('titleId')
            };
            
            // Valider
            const errors = validateForm(data);
            if (errors.length > 0) {
                errorMessage.innerHTML = errors.join('<br>');
                errorMessage.classList.remove('hidden');
                return;
            }
            
            // Cacher le message d'erreur
            errorMessage.classList.add('hidden');
            
            // Désactiver le bouton
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading"></span> Création...';
            
            try {
                // Créer l'employé
                await EmployeeAPI.create(data);
                
                // Rediriger vers la liste
                window.location.href = 'employees.html';
                
            } catch (error) {
                // Afficher l'erreur
                errorMessage.textContent = error.message;
                errorMessage.classList.remove('hidden');
                
                // Réactiver le bouton
                submitBtn.disabled = false;
                submitBtn.textContent = 'Créer l\'employé';
            }
        });
        
        // Charger les titres au chargement de la page
        loadTitles();
    </script>
</body>
</html>
```

---

## Gestion des erreurs

### Fichier : js/utils.js

```javascript
/**
 * Affiche un message d'erreur
 */
function showError(message, elementId = 'error-message') {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        
        // Cacher automatiquement après 5 secondes
        setTimeout(() => {
            errorElement.classList.add('hidden');
        }, 5000);
    }
}

/**
 * Affiche un message de succès
 */
function showSuccess(message, elementId = 'success-message') {
    const successElement = document.getElementById(elementId);
    if (successElement) {
        successElement.textContent = message;
        successElement.classList.remove('hidden');
        
        // Cacher automatiquement après 3 secondes
        setTimeout(() => {
            successElement.classList.add('hidden');
        }, 3000);
    }
}

/**
 * Gère les erreurs de manière globale
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('Erreur non gérée:', event.reason);
    showError('Une erreur inattendue s\'est produite.');
    event.preventDefault();
});
```

---

## Conclusion

### Ce que vous avez appris

Avec HTML/CSS/JavaScript Vanilla, vous avez créé :

1. **Système d'authentification complet**
   - Login avec JWT
   - Stockage du token
   - Protection des pages
   - Déconnexion

2. **Communication API**
   - Requêtes HTTP (GET, POST, PUT, DELETE)
   - Gestion des headers
   - Gestion des erreurs
   - Parsing JSON

3. **Interface utilisateur**
   - Pages HTML structurées
   - Styles CSS modernes
   - Interactivité JavaScript
   - Gestion du DOM

4. **Bonnes pratiques**
   - Séparation des fichiers (HTML, CSS, JS)
   - Fonctions réutilisables
   - Gestion des erreurs
   - Validation des formulaires

### Avantages constatés

- Aucune dépendance externe
- Chargement ultra-rapide
- Contrôle total du code
- Compréhension des fondamentaux

### Limitations observées

- Code répétitif pour chaque page
- Gestion manuelle du DOM
- Pas de composants réutilisables
- Difficile à maintenir sur de gros projets

### Prochaines étapes

Après avoir maîtrisé HTML Vanilla, vous pouvez explorer :

1. **Alpine.js** - Ajouter de la réactivité simplement
2. **Htmx** - Approche hypermedia moderne
3. **React** - Framework avec composants
4. **Vue.js** - Framework progressif facile

### Ressources

**Documentation**
- MDN Web Docs : https://developer.mozilla.org
- JavaScript.info : https://javascript.info
- Fetch API : https://developer.mozilla.org/fr/docs/Web/API/Fetch_API

**Tutoriels**
- FreeCodeCamp
- JavaScript30
- The Odin Project

---

**Félicitations ! Vous savez maintenant créer un frontend complet en HTML/CSS/JavaScript pur.**

