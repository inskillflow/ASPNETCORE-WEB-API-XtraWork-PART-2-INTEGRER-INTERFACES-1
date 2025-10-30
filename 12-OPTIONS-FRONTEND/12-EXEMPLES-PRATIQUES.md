# Exemples Pratiques et Exercices

## Table des matières

1. [Configuration Backend pour tous les frontends](#configuration-backend-pour-tous-les-frontends)
2. [Exercices progressifs](#exercices-progressifs)
3. [Projets complets](#projets-complets)
4. [Critères d'évaluation](#critères-dévaluation)
5. [Grille de correction](#grille-de-correction)

---

## Configuration Backend pour tous les frontends

### Modifier le CORS dans Program.cs

Pour accepter les requêtes de tous les frontends possibles, modifiez le fichier `XtraWork/Program.cs` :

```csharp
// CORS pour tous les frontends possibles
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllFrontends", policy =>
    {
        policy.WithOrigins(
            // Next.js (actuel)
            "http://localhost:3000",
            "https://localhost:3000",
            
            // Vite (React, Vue, Svelte)
            "http://localhost:5173",
            "https://localhost:5173",
            
            // Angular CLI
            "http://localhost:4200",
            "https://localhost:4200",
            
            // Create React App
            "http://localhost:3000",
            
            // Blazor
            "http://localhost:5000",
            "https://localhost:5001",
            
            // Serveur local générique
            "http://localhost:8080",
            "https://localhost:8080",
            
            // Live Server (VS Code)
            "http://localhost:5500",
            "http://127.0.0.1:5500",
            
            // Python HTTP Server
            "http://localhost:8000"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

// Utiliser le CORS (ligne à modifier)
app.UseCors("AllFrontends");  // Au lieu de "NextJsPolicy"
```

### Servir des fichiers statiques HTML (optionnel)

Pour servir directement des fichiers HTML depuis le backend :

```csharp
// Après app.UseSwaggerUI();
app.UseDefaultFiles();
app.UseStaticFiles();

// Créer un dossier wwwroot/ à la racine de XtraWork
// Y placer vos fichiers HTML
```

---

## Exercices progressifs

### Niveau 1 : Débutant (HTML Vanilla)

#### Exercice 1.1 : Afficher un message

**Objectif** : Créer une page HTML qui affiche un message "Hello XtraWork"

**Durée** : 15 minutes

**Fichier** : `hello.html`

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Hello XtraWork</title>
</head>
<body>
    <h1 id="message"></h1>
    
    <script>
        document.getElementById('message').textContent = 'Hello XtraWork';
    </script>
</body>
</html>
```

---

#### Exercice 1.2 : Tester la connexion API

**Objectif** : Vérifier que l'API fonctionne avec un appel GET

**Durée** : 30 minutes

**Fichier** : `test-api.html`

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Test API</title>
</head>
<body>
    <h1>Test de connexion à l'API</h1>
    <button onclick="testAPI()">Tester l'API</button>
    <div id="result"></div>
    
    <script>
        const API_URL = 'https://localhost:7033/api';
        
        async function testAPI() {
            const resultDiv = document.getElementById('result');
            resultDiv.textContent = 'Chargement...';
            
            try {
                const response = await fetch(`${API_URL}/titles`);
                const data = await response.json();
                
                resultDiv.innerHTML = `
                    <h2>Succès !</h2>
                    <p>L'API fonctionne. ${data.length} titres trouvés.</p>
                    <pre>${JSON.stringify(data, null, 2)}</pre>
                `;
            } catch (error) {
                resultDiv.innerHTML = `
                    <h2>Erreur</h2>
                    <p>${error.message}</p>
                    <p>Vérifiez que l'API est démarrée (dotnet run dans XtraWork/)</p>
                `;
            }
        }
    </script>
</body>
</html>
```

**Validation** :
- [ ] La page s'affiche
- [ ] Le bouton fonctionne
- [ ] Les titres s'affichent ou une erreur claire apparaît

---

#### Exercice 1.3 : Login simple

**Objectif** : Créer un formulaire de login fonctionnel

**Durée** : 1 heure

**Critères** :
- [ ] Formulaire avec username et password
- [ ] Appel POST à `/api/auth/login`
- [ ] Affichage du token reçu
- [ ] Gestion des erreurs (mauvais credentials)
- [ ] Stockage du token dans localStorage

**Code starter** :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
</head>
<body>
    <h1>Connexion</h1>
    <div id="error" style="color: red;"></div>
    
    <form id="loginForm">
        <div>
            <label>Username:</label>
            <input type="text" id="username" required>
        </div>
        <div>
            <label>Password:</label>
            <input type="password" id="password" required>
        </div>
        <button type="submit">Se connecter</button>
    </form>
    
    <div id="result"></div>
    
    <script>
        const API_URL = 'https://localhost:7033/api';
        
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            // À compléter par l'étudiant
        });
    </script>
</body>
</html>
```

---

#### Exercice 1.4 : Liste des employés

**Objectif** : Afficher la liste des employés dans un tableau

**Durée** : 1.5 heures

**Critères** :
- [ ] Vérifier qu'un token existe (sinon rediriger vers login)
- [ ] GET `/api/employees` avec le token dans Authorization
- [ ] Afficher dans un tableau HTML
- [ ] Formater la date de naissance
- [ ] Gestion des erreurs (401, 404, 500)
- [ ] Bouton de déconnexion

---

### Niveau 2 : Intermédiaire (Framework moderne)

#### Exercice 2.1 : Créer le projet

**Objectif** : Setup d'un projet React, Vue.js ou Svelte

**Durée** : 30 minutes

**Choisir UNE des options** :

**Option A : React avec Vite**
```bash
npm create vite@latest mon-frontend -- --template react
cd mon-frontend
npm install axios
npm install react-router-dom
npm run dev
```

**Option B : Vue.js**
```bash
npm create vue@latest mon-frontend
cd mon-frontend
npm install
npm install axios
npm run dev
```

**Option C : Svelte**
```bash
npm create vite@latest mon-frontend -- --template svelte
cd mon-frontend
npm install axios
npm run dev
```

**Validation** :
- [ ] Projet créé sans erreur
- [ ] Serveur de développement démarre
- [ ] Page d'accueil s'affiche
- [ ] Axios installé

---

#### Exercice 2.2 : Configuration API

**Objectif** : Créer un client API réutilisable

**Durée** : 45 minutes

**Fichier** : `src/services/api.js`

**Critères** :
- [ ] Instance Axios avec baseURL
- [ ] Intercepteur de requête pour ajouter le token
- [ ] Intercepteur de réponse pour gérer les erreurs
- [ ] Redirection vers login si 401
- [ ] Helpers pour GET, POST, PUT, DELETE

**Structure attendue** :
```javascript
// Configuration
const apiClient = axios.create({ ... });

// Intercepteurs
apiClient.interceptors.request.use(...);
apiClient.interceptors.response.use(...);

// Helpers
export const API = {
    get: (url) => ...,
    post: (url, data) => ...,
    put: (url, data) => ...,
    delete: (url) => ...
};
```

---

#### Exercice 2.3 : Page de login avec state

**Objectif** : Login avec gestion d'état du framework

**Durée** : 2 heures

**Critères React** :
- [ ] Composant Login avec useState
- [ ] Gestion du formulaire (onChange, onSubmit)
- [ ] Appel API avec async/await
- [ ] Context ou store pour l'authentification
- [ ] Redirection après login réussi
- [ ] Affichage des erreurs

**Critères Vue.js** :
- [ ] Composant LoginView.vue
- [ ] v-model pour les champs
- [ ] @submit.prevent
- [ ] Store Pinia pour l'authentification
- [ ] useRouter pour redirection
- [ ] Affichage conditionnel des erreurs

---

#### Exercice 2.4 : CRUD Complet

**Objectif** : Implémenter toutes les opérations CRUD pour les employés

**Durée** : 4 heures

**Pages attendues** :
- [ ] Liste des employés (GET /employees)
- [ ] Détail d'un employé (GET /employees/:id)
- [ ] Formulaire de création (POST /employees)
- [ ] Formulaire de modification (PUT /employees/:id)
- [ ] Suppression avec confirmation (DELETE /employees/:id)

**Critères d'évaluation** :
- [ ] Routing fonctionnel
- [ ] Composants réutilisables
- [ ] Gestion du loading
- [ ] Gestion des erreurs
- [ ] Validation des formulaires
- [ ] UX fluide (feedback utilisateur)

---

### Niveau 3 : Avancé

#### Exercice 3.1 : Authentification complète

**Objectif** : Système d'authentification production-ready

**Durée** : 3 heures

**Fonctionnalités** :
- [ ] Login
- [ ] Register
- [ ] Logout
- [ ] Protection des routes
- [ ] Persistance de la session
- [ ] Refresh automatique du token (si implémenté backend)
- [ ] Gestion des rôles (User, Manager, Admin)
- [ ] Affichage conditionnel selon le rôle

---

#### Exercice 3.2 : Optimisation des performances

**Objectif** : Améliorer les performances de l'application

**Durée** : 2 heures

**Techniques à implémenter** :
- [ ] Lazy loading des pages
- [ ] Memoization des composants
- [ ] Debounce sur les inputs de recherche
- [ ] Cache des données (React Query ou similaire)
- [ ] Code splitting
- [ ] Optimisation des images

**Mesure** :
- [ ] Score Lighthouse > 90
- [ ] Temps de chargement initial < 2s
- [ ] Time to Interactive < 3s

---

#### Exercice 3.3 : Tests automatisés

**Objectif** : Écrire des tests pour l'application

**Durée** : 3 heures

**Tests à écrire** :
- [ ] Test du service API
- [ ] Test du composant Login
- [ ] Test du store d'authentification
- [ ] Test de la liste des employés
- [ ] Test E2E du parcours complet (login → CRUD)

**Outils** :
- React : Jest + React Testing Library
- Vue : Vitest + Vue Test Utils
- E2E : Playwright ou Cypress

---

## Projets complets

### Projet 1 : Application de base (20 heures)

**Description** : Application CRUD complète avec authentification

**Fonctionnalités minimales** :
- [ ] Login / Logout
- [ ] Liste des employés
- [ ] Création d'un employé
- [ ] Modification d'un employé
- [ ] Suppression d'un employé
- [ ] Liste des titres
- [ ] Design responsive

**Technologies au choix** :
- HTML Vanilla + CSS
- React + Vite
- Vue.js + Vite
- Svelte + Vite

**Livrable** :
- Code source sur Git
- README avec instructions de démarrage
- Captures d'écran
- Documentation des choix techniques

---

### Projet 2 : Application avancée (40 heures)

**Description** : Application complète niveau production

**Fonctionnalités** :
- [ ] Toutes les fonctionnalités du Projet 1
- [ ] Register (inscription)
- [ ] Gestion des titres (CRUD complet)
- [ ] Recherche et filtres
- [ ] Pagination
- [ ] Tri des colonnes
- [ ] Dashboard avec statistiques
- [ ] Gestion des rôles (affichage conditionnel)
- [ ] Formulaires avec validation complète
- [ ] Messages toast / notifications
- [ ] Mode sombre / clair
- [ ] Tests unitaires (> 50% coverage)

**Technologies** :
- Next.js (recommandé) ou Angular
- TypeScript obligatoire
- State management (Redux, Pinia, etc.)
- UI Library (Material-UI, Vuetify, etc.)

**Livrable** :
- Code source sur Git
- Documentation complète
- Tests automatisés
- Déploiement en ligne (Vercel, Netlify, etc.)

---

### Projet 3 : Comparatif (50 heures)

**Description** : Implémenter la même application dans 3 frameworks différents

**Objectif pédagogique** : Comparer les approches

**Application à implémenter** : Projet 1 (version de base)

**Frameworks à utiliser** :
1. HTML Vanilla (référence)
2. React ou Vue.js
3. Au choix : Angular, Svelte, Blazor

**Analyse attendue** :
- [ ] Tableau comparatif (lignes de code, temps de dev, etc.)
- [ ] Avantages et inconvénients de chaque approche
- [ ] Mesure des performances (Lighthouse)
- [ ] Facilité de maintenance
- [ ] Courbe d'apprentissage

**Livrable** :
- 3 applications fonctionnelles
- Rapport d'analyse détaillé (10 pages minimum)
- Présentation PowerPoint
- Démonstration vidéo

---

## Critères d'évaluation

### Fonctionnalités (40 points)

- [ ] Login fonctionne (5 pts)
- [ ] Liste des employés affichée (5 pts)
- [ ] Création d'employé fonctionne (10 pts)
- [ ] Modification d'employé fonctionne (10 pts)
- [ ] Suppression d'employé fonctionne (5 pts)
- [ ] Gestion des erreurs (5 pts)

### Code (30 points)

- [ ] Code propre et lisible (10 pts)
- [ ] Structure organisée (5 pts)
- [ ] Pas de duplication (5 pts)
- [ ] Bonnes pratiques du framework (5 pts)
- [ ] Commentaires pertinents (5 pts)

### UX/UI (20 points)

- [ ] Design moderne et cohérent (10 pts)
- [ ] Responsive (5 pts)
- [ ] Loading states (3 pts)
- [ ] Messages d'erreur clairs (2 pts)

### Documentation (10 points)

- [ ] README complet (5 pts)
- [ ] Instructions de démarrage (3 pts)
- [ ] Capture d'écran (2 pts)

---

## Grille de correction

### Projet de base (sur 100)

| Critère | Points | Description |
|---------|--------|-------------|
| **Authentification** | 20 | Login, logout, token storage |
| **Liste employés** | 15 | Affichage, loading, erreurs |
| **Création** | 15 | Formulaire, validation, appel API |
| **Modification** | 15 | Formulaire pré-rempli, update |
| **Suppression** | 10 | Confirmation, appel API |
| **Code quality** | 15 | Structure, propreté, best practices |
| **UI/UX** | 10 | Design, responsive, feedback |

### Barème de notation

- **90-100** : Excellent - Toutes les fonctionnalités + bonus
- **75-89** : Très bien - Toutes les fonctionnalités
- **60-74** : Bien - Fonctionnalités principales
- **50-59** : Passable - Fonctionnalités de base
- **< 50** : Insuffisant - Fonctionnalités manquantes

---

## Conseils pour les étudiants

### Planning recommandé

**Semaine 1 : Setup et exploration**
- Jour 1-2 : Installation, configuration, test API
- Jour 3-4 : Comprendre l'architecture
- Jour 5 : Exercices niveau 1

**Semaine 2 : Développement**
- Jour 1-2 : Authentification
- Jour 3-4 : Liste et affichage
- Jour 5 : Formulaire de création

**Semaine 3 : Finalisation**
- Jour 1-2 : Modification et suppression
- Jour 3 : Amélioration UI/UX
- Jour 4 : Tests et corrections
- Jour 5 : Documentation et livraison

### Astuces

**Déboguer efficacement**
1. Utiliser les DevTools du navigateur (F12)
2. Vérifier l'onglet Network pour les requêtes API
3. Vérifier l'onglet Console pour les erreurs JavaScript
4. Utiliser console.log() pour tracer l'exécution

**Tester l'API sans frontend**
1. Utiliser Swagger : https://localhost:7033/swagger
2. Tester chaque endpoint avant de coder le frontend
3. Vérifier les formats de données attendus

**Gérer les certificats SSL**
1. Accepter manuellement le certificat dans le navigateur
2. Visiter https://localhost:7033 et cliquer "Avancé" > "Continuer"
3. Configurer le proxy Vite si nécessaire

---

## Ressources supplémentaires

### Documentation API

Toujours disponible sur : https://localhost:7033/swagger

### Exemples de requêtes

**Login** :
```bash
curl -X POST https://localhost:7033/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!"}'
```

**Liste des employés** :
```bash
curl -X GET https://localhost:7033/api/employees \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

---

**Bon courage pour vos projets !**

