# React - Frontend pour API ASP.NET Core

## Table des matières

1. [Introduction](#introduction)
2. [Avantages et inconvénients](#avantages-et-inconvénients)
3. [Prérequis](#prérequis)
4. [Création du projet](#création-du-projet)
5. [Structure du projet](#structure-du-projet)
6. [Configuration](#configuration)
7. [Communication avec l'API](#communication-avec-lapi)
8. [Authentification JWT](#authentification-jwt)
9. [Exemple : Page de login](#exemple--page-de-login)
10. [Exemple : Liste des employés](#exemple--liste-des-employés)
11. [Routing et protection des routes](#routing-et-protection-des-routes)
12. [State Management](#state-management)
13. [Conclusion](#conclusion)

---

## Introduction

**React** est une bibliothèque JavaScript créée par Facebook pour construire des interfaces utilisateur avec des composants réutilisables.

### Caractéristiques principales

- **Composants** : UI découpée en composants réutilisables
- **Virtual DOM** : Performance optimisée
- **JSX** : Syntaxe mixant JavaScript et HTML
- **Unidirectionnel** : Flux de données descendant
- **Hooks** : Logique réutilisable (useState, useEffect, etc.)

### Quand utiliser React

**Idéal pour** :
- Applications complexes avec beaucoup d'interactivité
- Projets nécessitant des composants réutilisables
- Équipes cherchant un écosystème riche
- Apprentissage du développement frontend moderne

**Pas idéal pour** :
- Sites statiques simples
- Débutants absolus (courbe d'apprentissage)
- Projets nécessitant du SEO sans SSR

---

## Avantages et inconvénients

### Avantages

**Popularité**
- Plus grande communauté
- Nombreuses bibliothèques tierces
- Beaucoup d'offres d'emploi

**Composants**
- Réutilisabilité maximale
- Testabilité facile
- Maintenance simplifiée

**Performance**
- Virtual DOM optimisé
- Lazy loading natif
- Code splitting

**Flexibilité**
- Pas d'opinions fortes
- Liberté architecturale
- Intégration facile

### Inconvénients

**Complexité**
- Courbe d'apprentissage
- Nombreux concepts à maîtriser
- Écosystème fragmenté

**Configuration**
- Setup initial plus long
- Choix de bibliothèques (routing, state, etc.)
- Build process obligatoire

**JSX**
- Syntaxe à apprendre
- Mélange HTML/JavaScript
- Peut dérouter au début

---

## Prérequis

### Connaissances requises

- JavaScript moderne (ES6+)
- Concepts de base : variables, fonctions, objets, arrays
- Promises et async/await
- HTML et CSS

### Outils nécessaires

**Node.js et npm**
```bash
# Vérifier l'installation
node --version    # v18 ou plus
npm --version     # 9 ou plus
```

**Installation** : https://nodejs.org/

---

## Création du projet

### Option 1 : Create React App (Simple)

```bash
# Créer le projet
npx create-react-app frontend-react
cd frontend-react

# Installer les dépendances nécessaires
npm install axios react-router-dom

# Lancer en développement
npm start
```

### Option 2 : Vite (Recommandé - Plus rapide)

```bash
# Créer le projet
npm create vite@latest frontend-react -- --template react
cd frontend-react

# Installer les dépendances
npm install
npm install axios react-router-dom

# Lancer en développement
npm run dev
```

L'application sera accessible sur : `http://localhost:5173` (Vite) ou `http://localhost:3000` (CRA)

---

## Structure du projet

```
frontend-react/
├── public/
│   └── index.html
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── Navbar.jsx
│   │   ├── EmployeeCard.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/              # Pages de l'application
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Employees.jsx
│   │   └── EmployeeForm.jsx
│   ├── services/           # Communication API
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── employeeService.js
│   ├── hooks/              # Custom hooks
│   │   ├── useAuth.js
│   │   └── useEmployees.js
│   ├── context/            # Context API (state global)
│   │   └── AuthContext.jsx
│   ├── utils/              # Fonctions utilitaires
│   │   └── helpers.js
│   ├── App.jsx             # Composant principal
│   ├── App.css             # Styles globaux
│   └── main.jsx            # Point d'entrée
├── package.json
└── vite.config.js
```

---

## Configuration

### 1. Fichier de configuration : src/config.js

```javascript
const config = {
    API_BASE_URL: import.meta.env.VITE_API_URL || 'https://localhost:7033/api',
    TOKEN_KEY: 'xtrawork_token',
    USER_KEY: 'xtrawork_user'
};

export default config;
```

### 2. Variables d'environnement : .env.local

```env
VITE_API_URL=https://localhost:7033/api
```

### 3. Accepter les certificats SSL auto-signés (dev)

**Fichier : vite.config.js**

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'https://localhost:7033',
                changeOrigin: true,
                secure: false // Accepter les certificats auto-signés
            }
        }
    }
})
```

---

## Communication avec l'API

### Fichier : src/services/api.js

```javascript
import axios from 'axios';
import config from '../config';

// Créer une instance Axios
const apiClient = axios.create({
    baseURL: config.API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Intercepteur de requête : Ajouter le token JWT
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('xtrawork_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Intercepteur de réponse : Gérer les erreurs
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expiré, rediriger vers login
            localStorage.removeItem('xtrawork_token');
            localStorage.removeItem('xtrawork_user');
            window.location.href = '/login';
        }
        
        return Promise.reject({
            message: error.response?.data?.message || 'Une erreur est survenue',
            status: error.response?.status
        });
    }
);

export default apiClient;
```

### Fichier : src/services/employeeService.js

```javascript
import apiClient from './api';

export const employeeService = {
    // Récupérer tous les employés
    async getAll() {
        const response = await apiClient.get('/employees');
        return response.data;
    },
    
    // Récupérer un employé par ID
    async getById(id) {
        const response = await apiClient.get(`/employees/${id}`);
        return response.data;
    },
    
    // Créer un employé
    async create(data) {
        const response = await apiClient.post('/employees', data);
        return response.data;
    },
    
    // Modifier un employé
    async update(id, data) {
        const response = await apiClient.put(`/employees/${id}`, data);
        return response.data;
    },
    
    // Supprimer un employé
    async delete(id) {
        await apiClient.delete(`/employees/${id}`);
    }
};
```

---

## Authentification JWT

### Fichier : src/services/authService.js

```javascript
import apiClient from './api';
import config from '../config';

export const authService = {
    // Connexion
    async login(username, password) {
        const response = await apiClient.post('/auth/login', {
            username,
            password
        });
        
        const { token, user } = response.data;
        
        // Sauvegarder dans localStorage
        localStorage.setItem(config.TOKEN_KEY, token);
        localStorage.setItem(config.USER_KEY, JSON.stringify(user));
        
        return response.data;
    },
    
    // Déconnexion
    async logout() {
        try {
            await apiClient.post('/auth/logout');
        } finally {
            localStorage.removeItem(config.TOKEN_KEY);
            localStorage.removeItem(config.USER_KEY);
        }
    },
    
    // Récupérer l'utilisateur actuel
    getCurrentUser() {
        const userJson = localStorage.getItem(config.USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    },
    
    // Vérifier si authentifié
    isAuthenticated() {
        return !!localStorage.getItem(config.TOKEN_KEY);
    }
};
```

### Context API : src/context/AuthContext.jsx

```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        // Charger l'utilisateur depuis localStorage au démarrage
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setLoading(false);
    }, []);
    
    const login = async (username, password) => {
        const data = await authService.login(username, password);
        setUser(data.user);
        return data;
    };
    
    const logout = async () => {
        await authService.logout();
        setUser(null);
    };
    
    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading
    };
    
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

// Hook personnalisé pour utiliser le contexte
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
```

---

## Exemple : Page de login

### Fichier : src/pages/Login.jsx

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            await login(formData.username, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Connexion XtraWork</h1>
                
                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Nom d'utilisateur</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>
                
                <div className="demo-info">
                    <strong>Compte de test :</strong><br />
                    Username : admin<br />
                    Password : Admin123!
                </div>
            </div>
        </div>
    );
}
```

---

## Exemple : Liste des employés

### Fichier : src/pages/Employees.jsx

```javascript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeService } from '../services/employeeService';
import Navbar from '../components/Navbar';
import './Employees.css';

export default function Employees() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    useEffect(() => {
        loadEmployees();
    }, []);
    
    const loadEmployees = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await employeeService.getAll();
            setEmployees(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    const handleDelete = async (id, name) => {
        if (!window.confirm(`Supprimer ${name} ?`)) {
            return;
        }
        
        try {
            await employeeService.delete(id);
            setEmployees(prev => prev.filter(e => e.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };
    
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR');
    };
    
    if (loading) {
        return (
            <>
                <Navbar />
                <div className="container">
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Chargement des employés...</p>
                    </div>
                </div>
            </>
        );
    }
    
    return (
        <>
            <Navbar />
            <div className="container">
                <div className="card">
                    <h1>Liste des employés</h1>
                    
                    {error && (
                        <div className="alert alert-error">{error}</div>
                    )}
                    
                    <div className="actions">
                        <button 
                            className="btn btn-primary"
                            onClick={() => navigate('/employees/new')}
                        >
                            Ajouter un employé
                        </button>
                    </div>
                    
                    {employees.length === 0 ? (
                        <p className="text-center">Aucun employé trouvé.</p>
                    ) : (
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
                            <tbody>
                                {employees.map(employee => (
                                    <tr key={employee.id}>
                                        <td>{employee.lastName}</td>
                                        <td>{employee.firstName}</td>
                                        <td>{formatDate(employee.birthDate)}</td>
                                        <td>{employee.gender}</td>
                                        <td>{employee.titleDescription}</td>
                                        <td>
                                            <button 
                                                className="btn btn-sm btn-primary"
                                                onClick={() => navigate(`/employees/${employee.id}`)}
                                            >
                                                Voir
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDelete(
                                                    employee.id, 
                                                    `${employee.firstName} ${employee.lastName}`
                                                )}
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
}
```

---

## Routing et protection des routes

### Fichier : src/components/ProtectedRoute.jsx

```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
}
```

### Fichier : src/App.jsx

```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EmployeeForm from './pages/EmployeeForm';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Routes publiques */}
                    <Route path="/login" element={<Login />} />
                    
                    {/* Routes protégées */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/employees" element={
                        <ProtectedRoute>
                            <Employees />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/employees/new" element={
                        <ProtectedRoute>
                            <EmployeeForm />
                        </ProtectedRoute>
                    } />
                    
                    {/* Redirection par défaut */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
```

---

## State Management

### Option 1 : Context API (inclus dans React)

Déjà utilisé ci-dessus pour l'authentification. Idéal pour état simple à partager.

### Option 2 : React Query (Recommandé pour API)

```bash
npm install @tanstack/react-query
```

```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '../services/employeeService';

// Hook personnalisé pour les employés
export function useEmployees() {
    return useQuery({
        queryKey: ['employees'],
        queryFn: employeeService.getAll
    });
}

// Hook pour supprimer un employé
export function useDeleteEmployee() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: employeeService.delete,
        onSuccess: () => {
            // Invalider et recharger la liste
            queryClient.invalidateQueries({ queryKey: ['employees'] });
        }
    });
}

// Utilisation dans un composant
function Employees() {
    const { data: employees, isLoading, error } = useEmployees();
    const deleteEmployee = useDeleteEmployee();
    
    const handleDelete = (id) => {
        deleteEmployee.mutate(id);
    };
    
    // ...
}
```

### Option 3 : Redux (Pour applications complexes)

```bash
npm install @reduxjs/toolkit react-redux
```

Configuration plus complexe, recommandé seulement pour grandes applications.

---

## Conclusion

### Ce que vous avez appris

**Concepts React**
- Composants fonctionnels
- Hooks (useState, useEffect)
- Context API
- Props et state
- Événements

**Architecture**
- Structure par fonctionnalité
- Séparation des responsabilités
- Services API
- Custom hooks

**Best Practices**
- Composants réutilisables
- Protection des routes
- Gestion d'erreurs
- Loading states

### Avantages constatés

- Composants réutilisables
- Code organisé et maintenable
- Écosystème riche
- Performance optimale

### Comparaison avec HTML Vanilla

| Aspect | HTML Vanilla | React |
|--------|-------------|--------|
| Code | Plus verbeux | Plus concis |
| Réutilisabilité | Faible | Élevée |
| Maintenance | Difficile | Facile |
| Performance | Excellente | Très bonne |
| Courbe apprentissage | Facile | Moyenne |

### Prochaines étapes

**Améliorer l'application**
- Ajouter React Query pour le caching
- Implémenter un formulaire complet avec validation
- Ajouter des tests (Jest + React Testing Library)
- Optimiser les performances (React.memo, useMemo)

**Explorer d'autres technologies**
- Next.js (React avec SSR)
- Vue.js (Alternative à React)
- Angular (Framework complet)

### Ressources

**Documentation officielle**
- React : https://react.dev
- React Router : https://reactrouter.com
- React Query : https://tanstack.com/query

**Tutoriels**
- React Tutorial (officiel)
- FreeCodeCamp React Course
- Scrimba React Course

**Outils**
- React DevTools (extension navigateur)
- Vite (build tool moderne)
- ESLint (linting)

---

**Vous savez maintenant créer une application React complète qui communique avec votre API ASP.NET Core !**

