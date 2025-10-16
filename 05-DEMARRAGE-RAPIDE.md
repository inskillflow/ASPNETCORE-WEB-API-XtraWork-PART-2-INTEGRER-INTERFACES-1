# ⚡ Démarrage Rapide - XtraWork Full Stack

Guide pour démarrer rapidement votre application XtraWork (Backend ASP.NET Core + Frontend Next.js)

---

## 🎯 En 3 Minutes

### 1️⃣ Démarrer le Backend (Terminal 1)

```bash
cd XtraWork
dotnet run
```

✅ Backend accessible sur : **https://localhost:7033**
✅ Swagger UI : **https://localhost:7033/swagger**

### 2️⃣ Installer et démarrer le Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend accessible sur : **http://localhost:3000**

### 3️⃣ Se connecter

1. Ouvrir **http://localhost:3000**
2. Cliquer sur **"Se connecter"**
3. Identifiants de test :
   - **Username** : `admin`
   - **Password** : `Admin123!`

---

## 📋 Checklist de Démarrage

### ✅ Prérequis

- [ ] .NET 8.0 SDK installé
- [ ] Node.js 18+ installé
- [ ] SQL Server en cours d'exécution
- [ ] Git installé (optionnel)

### ✅ Backend

- [x] CORS configuré pour Next.js
- [x] Authentification JWT activée
- [x] Base de données configurée
- [x] Swagger documentation activée

### ✅ Frontend

- [x] Types TypeScript alignés avec le backend
- [x] Services API configurés
- [x] Authentification JWT implémentée
- [x] Pages de base créées (Login, Register, Dashboard)
- [x] TailwindCSS configuré

---

## 🗂️ Structure du Projet

```
SuiviEtudiantsEtape2/
│
├── XtraWork/                    # 🔷 BACKEND (ASP.NET Core)
│   ├── Controllers/             # Endpoints API
│   ├── Services/                # Business logic
│   ├── Repositories/            # Data access
│   ├── Entities/                # Modèles de données
│   ├── Requests/                # DTOs entrée
│   ├── Responses/               # DTOs sortie
│   ├── Program.cs               # Configuration principale
│   └── appsettings.json         # Configuration (DB, JWT)
│
└── frontend/                    # 🟦 FRONTEND (Next.js 14)
    ├── src/
    │   ├── app/                 # Pages (App Router)
    │   ├── components/          # Composants réutilisables
    │   ├── services/            # Services API
    │   ├── types/               # Types TypeScript
    │   ├── lib/                 # Utilitaires
    │   ├── hooks/               # Custom hooks
    │   └── store/               # State management (Zustand)
    ├── package.json
    └── .env.local               # Configuration API
```

---

## 🚀 Commandes Utiles

### Backend

```bash
# Démarrer l'API
dotnet run

# Démarrer avec rechargement automatique
dotnet watch run

# Créer la base de données
dotnet ef database update

# Vérifier la santé de l'API
curl -k https://localhost:7033/health
```

### Frontend

```bash
# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev

# Build pour production
npm run build
npm start

# Vérifier les types TypeScript
npm run type-check

# Linter
npm run lint
```

---

## 🔌 Endpoints Principaux

### 🔐 Authentification

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/login` | Connexion |
| POST | `/api/auth/register` | Inscription |
| GET | `/api/auth/me` | Info utilisateur connecté |
| POST | `/api/auth/logout` | Déconnexion |

### 👥 Employés

| Méthode | Endpoint | Description | Rôle requis |
|---------|----------|-------------|-------------|
| GET | `/api/employees` | Liste des employés | User+ |
| GET | `/api/employees/{id}` | Détail employé | User+ |
| POST | `/api/employees` | Créer employé | User+ |
| PUT | `/api/employees/{id}` | Modifier employé | User+ |
| DELETE | `/api/employees/{id}` | Supprimer employé | Manager+ |

### 👔 Titres

| Méthode | Endpoint | Description | Rôle requis |
|---------|----------|-------------|-------------|
| GET | `/api/titles` | Liste des titres | User+ |
| GET | `/api/titles/{id}` | Détail titre | User+ |
| POST | `/api/titles` | Créer titre | Admin |
| PUT | `/api/titles/{id}` | Modifier titre | Manager+ |
| DELETE | `/api/titles/{id}` | Supprimer titre | Admin |

---

## 🔑 Rôles et Permissions

| Rôle | Permissions |
|------|-------------|
| **User** | Lire et créer des employés |
| **Manager** | User + modifier titres, supprimer employés |
| **Admin** | Tous les droits (créer/modifier/supprimer tout) |

---

## 🐛 Problèmes Courants

### ❌ Erreur : "Cannot connect to database"

**Solution** :
```bash
# Vérifier SQL Server
# Modifier XtraWork/appsettings.json avec votre connexion
```

### ❌ Erreur CORS dans le navigateur

**Solution** :
1. Vérifier que le backend est lancé
2. Vérifier `UseCors("NextJsPolicy")` dans `Program.cs`
3. Vérifier `NEXT_PUBLIC_API_URL` dans `frontend/.env.local`

### ❌ Token expiré / Redirection constante

**Solution** :
```javascript
// Dans la console du navigateur (F12)
localStorage.clear()
// Puis se reconnecter
```

### ❌ Port déjà utilisé

**Backend** :
```bash
# Modifier Properties/launchSettings.json
```

**Frontend** :
```bash
npm run dev -- -p 3001
```

---

## 📚 Documentation Complète

- **Frontend** : Voir `frontend/README.md`
- **Backend** : Voir `XtraWork/README.md`
- **Liaison Frontend-Backend** : Voir `GUIDE-FRONTEND-BACKEND.md`

---

## 🎨 Fonctionnalités Disponibles

### ✅ Implémenté

- [x] Authentification complète (Login/Register/Logout)
- [x] Dashboard utilisateur avec infos personnelles
- [x] Liste des employés avec détails
- [x] Liste des titres
- [x] Protection des routes par authentification
- [x] Gestion des rôles (User/Manager/Admin)
- [x] Messages d'erreur en français
- [x] Design moderne et responsive
- [x] Types TypeScript complets
- [x] Configuration CORS

### 🚧 À Développer

- [ ] Formulaires de création d'employés
- [ ] Formulaires de modification d'employés
- [ ] Formulaires de gestion des titres
- [ ] Recherche et filtrage avancé
- [ ] Pagination
- [ ] Statistiques et graphiques
- [ ] Export Excel/PDF
- [ ] Upload de photos de profil
- [ ] Notifications temps réel
- [ ] Mode sombre

---

## 🧪 Test Rapide

### 1. Test Backend (Swagger)

1. Ouvrir **https://localhost:7033/swagger**
2. Tester `/api/auth/login` avec :
   ```json
   {
     "username": "admin",
     "password": "Admin123!"
   }
   ```
3. Copier le token reçu
4. Cliquer sur **Authorize** 🔓
5. Entrer : `Bearer {votre-token}`
6. Tester `/api/employees` (devrait fonctionner)

### 2. Test Frontend

1. Ouvrir **http://localhost:3000**
2. Se connecter avec `admin` / `Admin123!`
3. Vérifier que le dashboard s'affiche
4. Naviguer vers **Employés**
5. Vérifier que la liste se charge

---

## 💡 Conseils de Développement

### Backend (ASP.NET Core)

```csharp
// Logs utiles pour débugger
Log.Information("Action réalisée: {Action}", action);

// Vérifier les claims utilisateur dans un controller
var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
```

### Frontend (Next.js)

```typescript
// Débugger l'état d'authentification
import { useAuthStore } from '@/store/auth.store';

const { user, isAuthenticated } = useAuthStore();
console.log({ user, isAuthenticated });

// Débugger une requête API
try {
  const data = await employeeService.getAll();
  console.log('Données reçues:', data);
} catch (error) {
  console.error('Erreur:', error);
}
```

---

## 🎯 Prochaines Étapes Recommandées

1. **Créer les formulaires de CRUD** pour Employés et Titres
2. **Ajouter la pagination** pour les grandes listes
3. **Implémenter la recherche** avec filtres avancés
4. **Ajouter des graphiques** pour les statistiques
5. **Créer des tests** unitaires et E2E
6. **Dockeriser** l'application
7. **Déployer** en production

---

## 📞 Support

### Ressources

- Documentation Next.js : https://nextjs.org/docs
- Documentation ASP.NET Core : https://docs.microsoft.com/aspnet/core
- Documentation TypeScript : https://www.typescriptlang.org/docs

### Fichiers Importants

- Configuration Backend : `XtraWork/Program.cs`
- Configuration Frontend : `frontend/next.config.mjs`
- Client API : `frontend/src/lib/api-client.ts`
- Store Auth : `frontend/src/store/auth.store.ts`

---

**✅ Tout est prêt ! Bon développement ! 🚀**

