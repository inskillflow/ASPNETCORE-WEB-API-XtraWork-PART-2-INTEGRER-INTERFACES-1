# 🎯 XtraWork - Application Full Stack

Application complète de gestion des employés avec backend ASP.NET Core et frontend Next.js.

---

## 📊 Vue d'ensemble

```
┌─────────────────────────────────────────────────────┐
│                 FRONTEND (Next.js 14)               │
│          http://localhost:3000                      │
│                                                     │
│  ✓ React + TypeScript                              │
│  ✓ TailwindCSS (Design moderne)                    │
│  ✓ Zustand (State management)                      │
│  ✓ Authentification JWT                            │
│  ✓ App Router (Next.js 14)                         │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ API REST + JWT
                   │
┌──────────────────▼──────────────────────────────────┐
│            BACKEND (ASP.NET Core 8.0)               │
│         https://localhost:7033                      │
│                                                     │
│  ✓ Architecture Clean (Controllers → Services →    │
│    Repositories)                                    │
│  ✓ Entity Framework Core                           │
│  ✓ JWT Authentication                              │
│  ✓ FluentValidation                                │
│  ✓ Serilog (Logging)                               │
│  ✓ Swagger/OpenAPI                                 │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
            ┌──────────────┐
            │ SQL Server   │
            └──────────────┘
```

---

## ⚡ Démarrage Rapide

### 1. Backend
```bash
cd XtraWork
dotnet run
```
✅ **https://localhost:7033** | Swagger : **/swagger**

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
✅ **http://localhost:3000**

### 3. Connexion
- **Username** : `admin`
- **Password** : `Admin123!`

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[DEMARRAGE-RAPIDE.md](DEMARRAGE-RAPIDE.md)** | 🚀 Guide pour démarrer en 3 minutes |
| **[GUIDE-FRONTEND-BACKEND.md](GUIDE-FRONTEND-BACKEND.md)** | 🔗 Comprendre la liaison Frontend ↔️ Backend |
| **[frontend/README.md](frontend/README.md)** | 🟦 Documentation complète du Frontend |
| **[XtraWork/README.md](XtraWork/README.md)** | 🔷 Documentation complète du Backend |

---

## 🏗️ Architecture

### Backend (ASP.NET Core)
```
XtraWork/
├── Controllers/        # API Endpoints
│   ├── AuthController.cs
│   ├── EmployeeController.cs
│   └── TitleController.cs
├── Services/           # Business Logic
├── Repositories/       # Data Access
├── Entities/           # Database Models
├── Requests/           # DTOs Input
├── Responses/          # DTOs Output
└── Validators/         # FluentValidation
```

### Frontend (Next.js)
```
frontend/src/
├── app/                # Pages (App Router)
│   ├── auth/           # Login, Register
│   └── dashboard/      # Protected pages
├── services/           # API Communication
├── types/              # TypeScript Types
├── lib/                # Utilities
├── hooks/              # Custom Hooks
└── store/              # State Management (Zustand)
```

---

## 🔐 Authentification

### Flow JWT
1. **Login** → Token JWT généré
2. **Token stocké** en localStorage
3. **Axios interceptor** ajoute automatiquement le token
4. **Backend valide** le token à chaque requête
5. **Redirection automatique** si token invalide

### Rôles
- **User** : Lecture + création employés
- **Manager** : User + modification titres + suppression employés
- **Admin** : Tous les droits

---

## 🛠️ Technologies

### Backend
- ASP.NET Core 8.0
- Entity Framework Core
- SQL Server
- JWT Authentication
- FluentValidation
- Serilog
- Swagger/OpenAPI

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript 5
- TailwindCSS 3
- Axios
- Zustand
- React Hook Form
- Zod

---

## 📋 Fonctionnalités

### ✅ Implémenté
- [x] Authentification complète (JWT)
- [x] Gestion des rôles
- [x] CRUD Employés (liste)
- [x] CRUD Titres (liste)
- [x] Dashboard utilisateur
- [x] Protection des routes
- [x] Design responsive
- [x] Gestion des erreurs
- [x] Types TypeScript complets
- [x] CORS configuré

### 🚧 À Développer
- [ ] Formulaires création/modification
- [ ] Recherche et filtres avancés
- [ ] Pagination
- [ ] Statistiques et graphiques
- [ ] Export Excel/PDF
- [ ] Upload photos
- [ ] Tests unitaires
- [ ] Tests E2E
- [ ] Docker
- [ ] CI/CD

---

## 🎯 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /api/auth/me` - Info utilisateur
- `POST /api/auth/logout` - Déconnexion

### Employés
- `GET /api/employees` - Liste
- `GET /api/employees/{id}` - Détail
- `POST /api/employees` - Créer
- `PUT /api/employees/{id}` - Modifier
- `DELETE /api/employees/{id}` - Supprimer (Manager+)

### Titres
- `GET /api/titles` - Liste
- `GET /api/titles/{id}` - Détail
- `POST /api/titles` - Créer (Admin)
- `PUT /api/titles/{id}` - Modifier (Manager+)
- `DELETE /api/titles/{id}` - Supprimer (Admin)

---

## 🔧 Configuration

### Backend (`XtraWork/appsettings.json`)
```json
{
  "ConnectionStrings": {
    "XtraWork": "Server=.;Database=XtraWork;..."
  },
  "Jwt": {
    "Issuer": "XtraWork-Issuer",
    "Audience": "XtraWork-Audience",
    "Key": "votre-cle-secrete-64-caracteres"
  }
}
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=https://localhost:7033/api
NODE_TLS_REJECT_UNAUTHORIZED=0  # Dev uniquement
```

---

## 🐛 Troubleshooting

| Problème | Solution |
|----------|----------|
| **Erreur CORS** | Vérifier `UseCors("NextJsPolicy")` dans `Program.cs` |
| **Token expiré** | `localStorage.clear()` dans la console puis reconnecter |
| **Cannot connect to DB** | Vérifier SQL Server et la chaîne de connexion |
| **Port déjà utilisé** | Backend : modifier `launchSettings.json`<br>Frontend : `npm run dev -- -p 3001` |

---

## 📞 Commandes Utiles

### Backend
```bash
dotnet run                    # Démarrer l'API
dotnet watch run              # Avec rechargement auto
dotnet ef database update     # Créer/mettre à jour la DB
```

### Frontend
```bash
npm run dev                   # Mode développement
npm run build                 # Build production
npm run type-check            # Vérifier les types
npm run lint                  # Linter
```

---

## 🎓 Best Practices Appliquées

### ✅ Architecture
- Clean Architecture (Backend)
- Séparation des responsabilités
- Dependency Injection
- Repository Pattern
- Service Layer Pattern

### ✅ Sécurité
- JWT Authentication
- Role-based Authorization
- Password Hashing (BCrypt)
- CORS configuré correctement
- Input Validation (FluentValidation + Zod)

### ✅ Code Quality
- TypeScript strict mode
- Types complets pour tous les DTOs
- Error handling centralisé
- Logging structuré (Serilog)
- Code formaté et documenté

---

## 📈 Prochaines Étapes

1. **Formulaires CRUD** pour Employés et Titres
2. **Pagination** côté serveur
3. **Recherche avancée** avec filtres
4. **Statistiques** avec graphiques
5. **Tests** unitaires et E2E
6. **Docker** containerization
7. **CI/CD** pipeline
8. **Déploiement** en production

---

## 📄 Licence

Projet éducatif - XtraWork Application

---

## 👨‍💻 Auteur

Application de gestion des employés avec authentification JWT

---

## 🚀 Commencer Maintenant

1. Lire **[DEMARRAGE-RAPIDE.md](DEMARRAGE-RAPIDE.md)**
2. Démarrer le backend : `cd XtraWork && dotnet run`
3. Démarrer le frontend : `cd frontend && npm install && npm run dev`
4. Ouvrir **http://localhost:3000**
5. Se connecter avec `admin` / `Admin123!`

**Bon développement ! 🎉**

