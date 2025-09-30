# 🚀 XtraWork API - Guide Complet

API REST ASP.NET Core 8.0 avec authentification JWT, validation FluentValidation, logging Serilog et Health Checks.

---

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Lancement](#-lancement)
- [Tests](#-tests)
- [Endpoints API](#-endpoints-api)
- [Authentification JWT](#-authentification-jwt)
- [Architecture](#-architecture)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Fonctionnalités

### ✅ Sécurité
- **Authentification JWT** avec Bearer tokens
- **Autorisation basée sur les rôles** (User, Manager, Admin)
- **Hachage des mots de passe** avec BCrypt
- **Validation des tokens** JWT

### ✅ Validation
- **FluentValidation** pour validation robuste
- Règles de validation personnalisées
- Messages d'erreur en français
- Validation des âges, emails, genres

### ✅ Monitoring
- **Serilog** pour logging avancé
- Logs console + fichiers rotatifs
- **Health Checks** pour surveillance
- Logs des requêtes HTTP

### ✅ API
- **Swagger/OpenAPI** intégré
- Pagination et filtrage
- CRUD complet (Titles, Employees, Users)
- Gestion des erreurs standardisée

---

## 📦 Prérequis

- **.NET 8.0 SDK** ou supérieur
- **SQL Server** (LocalDB, Express ou Standard)
- **PowerShell** pour scripts de test
- **Visual Studio 2022** ou **VS Code** (recommandé)

---

## 🛠️ Installation

### 1. Cloner ou télécharger le projet

```bash
cd XtraWork
```

### 2. Restaurer les packages NuGet

```powershell
dotnet restore
```

### 3. Configurer la base de données

Modifier `appsettings.json` avec votre chaîne de connexion :

```json
{
  "ConnectionStrings": {
    "XtraWork": "Server=.;Database=XtraWork;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

### 4. Créer la base de données

```powershell
dotnet ef database update
```

Ou laisser l'API créer automatiquement la DB au premier lancement (EnsureCreated).

---

## ⚙️ Configuration

### Configuration JWT

Dans `appsettings.json` :

```json
{
  "Jwt": {
    "Issuer": "XtraWork-Issuer",
    "Audience": "XtraWork-Audience",
    "Key": "VOTRE_CLE_SECRETE_64_CARACTERES_MINIMUM"
  }
}
```

⚠️ **Pour la production**, utilisez User Secrets :

```powershell
dotnet user-secrets init
dotnet user-secrets set "Jwt:Key" "VOTRE_CLE_PRODUCTION"
```

### Configuration Serilog

Les logs sont écrits dans :
- **Console** : Temps réel
- **Fichiers** : `logs/xtrawork-YYYYMMDD.txt` (30 jours de rétention)

Configuration dans `appsettings.json` section `Serilog`.

---

## 🚀 Lancement

### Mode développement

```powershell
dotnet run
```

Ou avec rechargement automatique :

```powershell
dotnet watch run
```

### URLs d'accès

- **API** : `https://localhost:7033`
- **Swagger UI** : `https://localhost:7033/swagger`
- **Health Check** : `https://localhost:7033/health`

### Mode production

```powershell
$env:ASPNETCORE_ENVIRONMENT="Production"
dotnet run --configuration Release
```

---

## 🧪 Tests

### Script de test automatique

```powershell
cd scripts
.\test-api.ps1
```

### Tests manuels avec cURL

#### 1. Health Check
```powershell
curl -k https://localhost:7033/health
```

#### 2. Inscription
```powershell
curl -k -X POST "https://localhost:7033/api/auth/register" `
  -H "Content-Type: application/json" `
  -d '{
    "username": "admin",
    "email": "admin@xtrawork.com",
    "password": "Admin123!",
    "firstName": "Jean",
    "lastName": "Administrateur"
  }'
```

#### 3. Connexion
```powershell
$response = Invoke-RestMethod -Uri "https://localhost:7033/api/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"username":"admin","password":"Admin123!"}' `
  -SkipCertificateCheck

$token = $response.token
```

#### 4. Récupérer les titres (avec token)
```powershell
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri "https://localhost:7033/api/titles" -Headers $headers -SkipCertificateCheck
```

### Tests avec Swagger

1. Ouvrir `https://localhost:7033/swagger`
2. Cliquer sur **Authorize** 🔓
3. Entrer : `Bearer {votre-token}`
4. Cliquer **Authorize**
5. Tester les endpoints 🚀

---

## 📡 Endpoints API

### 🔐 Authentification

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/auth/register` | Inscription | Non |
| POST | `/api/auth/login` | Connexion | Non |
| GET | `/api/auth/me` | Info utilisateur | Oui |
| POST | `/api/auth/validate` | Valider token | Non |
| POST | `/api/auth/logout` | Déconnexion | Oui |

### 👔 Titles (Postes)

| Méthode | Endpoint | Description | Rôles |
|---------|----------|-------------|-------|
| GET | `/api/titles` | Liste des titres | User+ |
| GET | `/api/titles/{id}` | Détail d'un titre | User+ |
| POST | `/api/titles` | Créer un titre | Admin |
| PUT | `/api/titles/{id}` | Modifier un titre | Manager+ |
| DELETE | `/api/titles/{id}` | Supprimer un titre | Admin |

### 👥 Employees (Employés)

| Méthode | Endpoint | Description | Rôles |
|---------|----------|-------------|-------|
| GET | `/api/employees` | Liste des employés | User+ |
| GET | `/api/employees/{id}` | Détail employé | User+ |
| POST | `/api/employees` | Créer employé | User+ |
| PUT | `/api/employees/{id}` | Modifier employé | User+ |
| DELETE | `/api/employees/{id}` | Supprimer employé | Manager+ |

### 🏥 Health Check

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/health` | État de l'API et DB | Non |

---

## 🔒 Authentification JWT

### Format du token

```
Authorization: Bearer {token}
```

### Exemple complet

```powershell
# 1. Login
$loginResponse = Invoke-RestMethod -Uri "https://localhost:7033/api/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"username":"admin","password":"Admin123!"}' `
  -SkipCertificateCheck

# 2. Extraire le token
$token = $loginResponse.token

# 3. Utiliser le token
$headers = @{ Authorization = "Bearer $token" }
$titles = Invoke-RestMethod -Uri "https://localhost:7033/api/titles" `
  -Headers $headers `
  -SkipCertificateCheck
```

### Rôles disponibles

| Rôle | Permissions |
|------|-------------|
| **User** | Lecture, création d'employés |
| **Manager** | User + modification titres, suppression employés |
| **Admin** | Tous les droits |

---

## 🏗️ Architecture

```
XtraWork/
├── Controllers/          # Contrôleurs API
│   ├── AuthController.cs
│   ├── TitleController.cs
│   └── EmployeeController.cs
├── Services/             # Logique métier
│   ├── AuthService.cs
│   ├── TitleService.cs
│   └── EmployeeService.cs
├── Repositories/         # Accès données
│   ├── UserRepository.cs
│   ├── TitleRepository.cs
│   ├── EmployeeRepository.cs
│   └── XtraWorkContext.cs
├── Entities/             # Modèles de données
│   ├── User.cs
│   ├── Title.cs
│   └── Employee.cs
├── Requests/             # DTOs entrée
├── Responses/            # DTOs sortie
├── Validators/           # FluentValidation
├── Exceptions/           # Exceptions custom
└── Models/               # Modèles utilitaires
```

### Pattern utilisé

- **Repository Pattern** : Séparation accès données
- **Service Layer** : Logique métier isolée
- **DTOs** : Découplage modèles/API
- **Dependency Injection** : Inversion de contrôle

---

## 🔧 Troubleshooting

### Erreur : "Jwt:Key manquant"

**Solution** : Vérifier `appsettings.json` ou User Secrets

```powershell
dotnet user-secrets set "Jwt:Key" "VOTRE_CLE_64_CARACTERES"
```

### Erreur : "Cannot connect to database"

**Solutions** :
1. Vérifier SQL Server est démarré
2. Tester la chaîne de connexion
3. Vérifier les permissions

```powershell
# Tester la connexion
sqlcmd -S . -E -Q "SELECT @@VERSION"
```

### Erreur 401 sur tous les endpoints

**Solutions** :
1. Vérifier que le token est bien inclus
2. Format : `Authorization: Bearer {token}`
3. Token pas expiré (24h par défaut)

### Logs ne s'écrivent pas

**Solutions** :
1. Créer le dossier `logs/` manuellement
2. Vérifier les permissions d'écriture
3. Consulter les logs console

### Port déjà utilisé

**Solution** : Modifier `Properties/launchSettings.json`

```json
{
  "applicationUrl": "https://localhost:7034;http://localhost:5281"
}
```

---

## 📚 Ressources

- [Documentation ASP.NET Core](https://docs.microsoft.com/aspnet/core)
- [FluentValidation](https://docs.fluentvalidation.net/)
- [Serilog](https://serilog.net/)
- [JWT.io](https://jwt.io/)

---

## 📄 Licence

Ce projet est à usage éducatif.

---

## 👨‍💻 Auteur

Projet XtraWork - API de gestion des employés

---

## 🎯 Prochaines étapes (Extensions possibles)

- [ ] Tests unitaires et d'intégration
- [ ] Cache Redis pour performance
- [ ] Pagination avancée
- [ ] Export Excel/PDF
- [ ] Notifications temps réel (SignalR)
- [ ] Audit Trail complet
- [ ] Rate Limiting
- [ ] CORS configuré
- [ ] Docker containerization
- [ ] CI/CD Pipeline

---

**Bon développement ! 🚀**
