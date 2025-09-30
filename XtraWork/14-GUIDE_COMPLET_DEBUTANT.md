# Guide Ultra-Complet : API XtraWork pour Débutants

## Table des Matières

1. [Introduction](#introduction)
2. [Architecture du Projet](#architecture-du-projet)
3. [Schéma de Base de Données](#schéma-de-base-de-données)
4. [Installation et Configuration](#installation-et-configuration)
5. [Démarrage de l'API](#démarrage-de-lapi)
6. [Authentification et Sécurité](#authentification-et-sécurité)
7. [Utilisation de l'API](#utilisation-de-lapi)
8. [Tests Complets](#tests-complets)
9. [Dépannage](#dépannage)
10. [FAQ](#faq)

---

## Introduction

### Qu'est-ce que XtraWork ?

XtraWork est une **API REST** (Application Programming Interface) développée en **ASP.NET Core** qui permet de gérer des employés et leurs postes dans une entreprise.

**En termes simples :**
- C'est comme un serveur qui répond à des demandes
- Vous lui demandez des informations (GET)
- Vous lui envoyez des informations (POST)
- Vous modifiez des informations (PUT)
- Vous supprimez des informations (DELETE)

### Technologies Utilisées

| Technologie | Rôle | Pourquoi |
|-------------|------|----------|
| **C#** | Langage de programmation | Puissant et facile à apprendre |
| **ASP.NET Core 8.0** | Framework web | Moderne, rapide, cross-platform |
| **Entity Framework Core** | ORM (Object-Relational Mapping) | Simplifie l'accès à la base de données |
| **SQL Server** | Base de données | Stockage des données |
| **JWT** | Authentification | Sécurise l'API |
| **FluentValidation** | Validation | Vérifie les données |
| **Serilog** | Logging | Enregistre les événements |
| **Swagger** | Documentation | Interface web pour tester |

---

## Architecture du Projet

### Diagramme d'Architecture Globale

```mermaid
graph TB
    Client[Client Web/Mobile]
    API[API XtraWork]
    Auth[Service Authentification]
    BL[Services Métier]
    Repo[Repositories]
    DB[(Base de Données SQL Server)]
    
    Client -->|Requêtes HTTPS| API
    API -->|Vérifie Token| Auth
    API -->|Logique métier| BL
    BL -->|Accès données| Repo
    Repo -->|Entity Framework| DB
    
    style API fill:#4CAF50,color:#fff
    style DB fill:#2196F3,color:#fff
    style Auth fill:#FF9800,color:#fff
```

### Structure des Dossiers

```
XtraWork/
│
├── Controllers/          # Points d'entrée de l'API (endpoints)
│   ├── AuthController.cs
│   ├── EmployeeController.cs
│   └── TitleController.cs
│
├── Entities/            # Modèles de données (tables DB)
│   ├── User.cs
│   ├── Employee.cs
│   └── Title.cs
│
├── Repositories/        # Accès à la base de données
│   ├── XtraWorkContext.cs
│   ├── UserRepository.cs
│   ├── EmployeeRepository.cs
│   └── TitleRepository.cs
│
├── Services/           # Logique métier
│   ├── AuthService.cs
│   ├── EmployeeService.cs
│   └── TitleService.cs
│
├── Requests/          # Modèles de requêtes
│   ├── LoginRequest.cs
│   ├── RegisterRequest.cs
│   ├── EmployeeRequest.cs
│   └── TitleRequest.cs
│
├── Responses/         # Modèles de réponses
│   ├── AuthResponse.cs
│   ├── EmployeeResponse.cs
│   └── TitleResponse.cs
│
├── Validators/        # Règles de validation
│   ├── EmployeeRequestValidator.cs
│   └── TitleRequestValidator.cs
│
├── Exceptions/        # Exceptions personnalisées
│   └── NotFoundException.cs
│
├── appsettings.json   # Configuration
├── Program.cs         # Point d'entrée
└── XtraWork.csproj   # Fichier projet
```

### Flux de Traitement d'une Requête

```mermaid
sequenceDiagram
    participant C as Client
    participant API as Controller
    participant Auth as Authentification
    participant S as Service
    participant R as Repository
    participant DB as Base de Données

    C->>API: POST /api/employees
    API->>Auth: Vérifier Token JWT
    Auth-->>API: Token valide
    API->>S: Create(employeeRequest)
    S->>S: Validation FluentValidation
    S->>R: Create(employee)
    R->>DB: INSERT INTO Employees
    DB-->>R: Employee créé
    R-->>S: Employee
    S-->>API: EmployeeResponse
    API-->>C: 201 Created + JSON
```

---

## Schéma de Base de Données

### Diagramme Entité-Relation (ERD)

```mermaid
erDiagram
    USERS ||--o{ AUTH_TOKENS : "possède"
    TITLES ||--o{ EMPLOYEES : "a"
    
    USERS {
        uniqueidentifier Id PK
        nvarchar(50) Username UK
        nvarchar(100) Email UK
        nvarchar(255) PasswordHash
        nvarchar(20) Role
        nvarchar(50) FirstName
        nvarchar(50) LastName
        bit IsActive
        datetime2 CreatedAt
        datetime2 LastLoginAt
    }
    
    TITLES {
        uniqueidentifier Id PK
        nvarchar(100) Description
        datetime2 CreatedAt
    }
    
    EMPLOYEES {
        uniqueidentifier Id PK
        nvarchar(50) FirstName
        nvarchar(50) LastName
        date BirthDate
        nvarchar(10) Gender
        uniqueidentifier TitleId FK
        datetime2 CreatedAt
    }
    
    AUTH_TOKENS {
        string Token
        datetime Expiration
    }
```

### Description des Tables

#### Table `Users` (Utilisateurs)

| Colonne | Type | Description | Contrainte |
|---------|------|-------------|------------|
| `Id` | UNIQUEIDENTIFIER | Identifiant unique | PRIMARY KEY, DEFAULT NEWID() |
| `Username` | NVARCHAR(50) | Nom d'utilisateur | UNIQUE, NOT NULL |
| `Email` | NVARCHAR(100) | Adresse email | UNIQUE, NOT NULL |
| `PasswordHash` | NVARCHAR(255) | Mot de passe hashé (BCrypt) | NOT NULL |
| `Role` | NVARCHAR(20) | Rôle (User/Manager/Admin) | NOT NULL, DEFAULT 'User' |
| `FirstName` | NVARCHAR(50) | Prénom | NOT NULL |
| `LastName` | NVARCHAR(50) | Nom de famille | NOT NULL |
| `IsActive` | BIT | Compte actif ou non | DEFAULT 1 |
| `CreatedAt` | DATETIME2 | Date de création | DEFAULT GETUTCDATE() |
| `LastLoginAt` | DATETIME2 | Dernière connexion | NULL |

**Exemple de données :**
```
Id: 3F2504E0-4F89-41D3-9A0C-0305E82C3301
Username: marie.user
Email: marie@xtrawork.com
PasswordHash: $2a$11$Xv8pqKl...
Role: User
FirstName: Marie
LastName: Dupont
IsActive: 1
CreatedAt: 2025-09-30 10:30:00
LastLoginAt: 2025-09-30 14:25:00
```

#### Table `Titles` (Postes)

| Colonne | Type | Description | Contrainte |
|---------|------|-------------|------------|
| `Id` | UNIQUEIDENTIFIER | Identifiant unique | PRIMARY KEY, DEFAULT NEWID() |
| `Description` | NVARCHAR(100) | Nom du poste | NOT NULL |
| `CreatedAt` | DATETIME2 | Date de création | DEFAULT GETUTCDATE() |

**Exemple de données :**
```
Id: 7F8A9B1C-2D3E-4F5A-6B7C-8D9E0F1A2B3C
Description: Développeur Full Stack
CreatedAt: 2025-09-30 09:00:00
```

#### Table `Employees` (Employés)

| Colonne | Type | Description | Contrainte |
|---------|------|-------------|------------|
| `Id` | UNIQUEIDENTIFIER | Identifiant unique | PRIMARY KEY, DEFAULT NEWID() |
| `FirstName` | NVARCHAR(50) | Prénom | NOT NULL |
| `LastName` | NVARCHAR(50) | Nom de famille | NOT NULL |
| `BirthDate` | DATE | Date de naissance | NOT NULL |
| `Gender` | NVARCHAR(10) | Genre (M/F) | NOT NULL |
| `TitleId` | UNIQUEIDENTIFIER | Référence au poste | FOREIGN KEY -> Titles(Id) |
| `CreatedAt` | DATETIME2 | Date de création | DEFAULT GETUTCDATE() |

**Exemple de données :**
```
Id: 1A2B3C4D-5E6F-7A8B-9C0D-1E2F3A4B5C6D
FirstName: Pierre
LastName: Durand
BirthDate: 1990-03-15
Gender: M
TitleId: 7F8A9B1C-2D3E-4F5A-6B7C-8D9E0F1A2B3C
CreatedAt: 2025-09-30 11:15:00
```

### Diagramme des Relations

```mermaid
graph LR
    E[Employee]
    T[Title]
    
    E -->|TitleId| T
    
    style E fill:#FFE082,color:#000,stroke:#333,stroke-width:2px
    style T fill:#80DEEA,color:#000,stroke:#333,stroke-width:2px
```

**Explication :**
- Un `Employee` (employé) a **UN SEUL** `Title` (poste)
- Un `Title` (poste) peut être associé à **PLUSIEURS** `Employees` (employés)
- Relation : **One-to-Many** (1:N)

---

## Installation et Configuration

### Prérequis

#### 1. Installer .NET 8.0 SDK

**Vérifier si déjà installé :**
```powershell
dotnet --version
```

**Si non installé :**
1. Aller sur https://dotnet.microsoft.com/download
2. Télécharger .NET 8.0 SDK
3. Installer et redémarrer le PC

#### 2. Installer SQL Server

**Versions compatibles :**
- SQL Server 2019
- SQL Server 2022
- SQL Server Express (gratuit)

**Étapes :**
1. Télécharger : https://www.microsoft.com/sql-server/sql-server-downloads
2. Installer SQL Server Developer Edition (gratuite)
3. Installer SQL Server Management Studio (SSMS)

**Vérifier l'installation :**
```powershell
sqlcmd -S LAPTOP-81IAD844 -E -Q "SELECT @@VERSION"
```

#### 3. Installer un Éditeur de Code

**Options :**
- Visual Studio Code (gratuit, léger)
- Visual Studio Community 2022 (gratuit, complet)

### Configuration du Projet

#### 1. Cloner ou Télécharger le Projet

```powershell
# Si vous avez Git
git clone <URL_DU_REPO>

# OU téléchargez le ZIP et extrayez
```

#### 2. Naviguer vers le Dossier

```powershell
cd C:\Users\rehou\Downloads\2-SuiviEtudiantsEtape2\SuiviEtudiantsEtape2\XtraWork
```

#### 3. Vérifier le Fichier appsettings.json

**Ouvrir le fichier :**
```powershell
notepad appsettings.json
```

**Contenu important :**
```json
{
  "ConnectionStrings": {
    "XtraWork": "Server=LAPTOP-81IAD844;Database=XtraWork;Trusted_Connection=True;Encrypt=True;TrustServerCertificate=True"
  },
  "Jwt": {
    "Issuer": "XtraWorkAPI",
    "Audience": "XtraWorkClients",
    "Key": "VotreCléSecrèteTrèsLongueEtComplexe123456789!"
  }
}
```

**Modifier si nécessaire :**
- Remplacer `LAPTOP-81IAD844` par le nom de votre serveur SQL
- Pour trouver votre nom de serveur : ouvrir SSMS et regarder le nom de connexion

#### 4. Restaurer les Packages NuGet

```powershell
dotnet restore
```

**Ce que cette commande fait :**
- Télécharge toutes les bibliothèques nécessaires
- Exemple : Entity Framework, JWT, FluentValidation, etc.

#### 5. Compiler le Projet

```powershell
dotnet build
```

**Résultat attendu :**
```
Build succeeded.
    0 Warning(s)
    0 Error(s)
```

---

## Démarrage de l'API

### Méthode 1 : Commande Simple

```powershell
# Aller dans le dossier
cd C:\Users\rehou\Downloads\2-SuiviEtudiantsEtape2\SuiviEtudiantsEtape2\XtraWork

# Lancer
dotnet run
```

### Méthode 2 : Script Automatique

```powershell
.\LANCER_API_PROPREMENT.ps1
```

### Que se passe-t-il au Démarrage ?

```mermaid
graph TD
    A[dotnet run] --> B[Lire appsettings.json]
    B --> C[Configurer les Services]
    C --> D{Base de données existe ?}
    D -->|NON| E[Créer la base XtraWork]
    D -->|OUI| F[Utiliser la base existante]
    E --> G[Créer les tables]
    G --> H[Démarrer le serveur Kestrel]
    F --> H
    H --> I[API prête sur ports 7033 et 5280]
    
    style A fill:#4CAF50,color:#fff
    style I fill:#2196F3,color:#fff
```

### Vérifier que l'API fonctionne

**Dans un NOUVEAU terminal PowerShell :**

```powershell
Invoke-WebRequest -Uri "https://localhost:7033/health"
```

**Résultat attendu :**
```
StatusCode        : 200
StatusDescription : OK
Content           : Healthy
```

**Ou ouvrir dans le navigateur :**
```
https://localhost:7033/swagger/index.html
```

Vous verrez l'interface Swagger avec tous les endpoints !

---

## Authentification et Sécurité

### Comprendre JWT (JSON Web Token)

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant API as API
    participant DB as Base de Données

    U->>API: POST /api/auth/login<br/>{username, password}
    API->>DB: Vérifier les identifiants
    DB-->>API: Utilisateur trouvé
    API->>API: Générer Token JWT
    API-->>U: {token: "eyJhbGc..."}
    
    Note over U: L'utilisateur conserve le token
    
    U->>API: GET /api/employees<br/>Authorization: Bearer eyJhbGc...
    API->>API: Valider le token
    API->>DB: Récupérer les employés
    DB-->>API: Liste des employés
    API-->>U: {employees: [...]}
```

### Structure d'un Token JWT

Un token JWT ressemble à ceci :
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Décomposition :**
1. **Header** (en-tête) : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
   - Algorithme : HS256
   - Type : JWT

2. **Payload** (données) : `eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ`
   - ID utilisateur
   - Nom d'utilisateur
   - Rôle
   - Date d'expiration

3. **Signature** : `SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`
   - Garantit l'intégrité du token

### Rôles et Permissions

```mermaid
graph TD
    subgraph Rôles
        User[User<br/>Utilisateur basique]
        Manager[Manager<br/>Gestionnaire]
        Admin[Admin<br/>Administrateur]
    end
    
    subgraph Permissions
        ReadT[Lire Titles]
        CreateT[Créer Titles]
        UpdateT[Modifier Titles]
        DeleteT[Supprimer Titles]
        ReadE[Lire Employees]
        CreateE[Créer Employees]
        UpdateE[Modifier Employees]
        DeleteE[Supprimer Employees]
    end
    
    User --> ReadT
    User --> ReadE
    User --> CreateE
    User --> UpdateE
    
    Manager --> ReadT
    Manager --> CreateT
    Manager --> UpdateT
    Manager --> ReadE
    Manager --> CreateE
    Manager --> UpdateE
    Manager --> DeleteE
    
    Admin --> ReadT
    Admin --> CreateT
    Admin --> UpdateT
    Admin --> DeleteT
    Admin --> ReadE
    Admin --> CreateE
    Admin --> UpdateE
    Admin --> DeleteE
    
    style User fill:#FFE082,color:#000,stroke:#333,stroke-width:3px
    style Manager fill:#80DEEA,color:#000,stroke:#333,stroke-width:3px
    style Admin fill:#EF5350,color:#fff,stroke:#333,stroke-width:3px
```

### Tableau des Permissions

| Endpoint | Méthode | User | Manager | Admin |
|----------|---------|------|---------|-------|
| `/api/titles` | GET | ✅ | ✅ | ✅ |
| `/api/titles` | POST | ❌ | ✅ | ✅ |
| `/api/titles/{id}` | PUT | ❌ | ✅ | ✅ |
| `/api/titles/{id}` | DELETE | ❌ | ❌ | ✅ |
| `/api/employees` | GET | ✅ | ✅ | ✅ |
| `/api/employees` | POST | ✅ | ✅ | ✅ |
| `/api/employees/{id}` | PUT | ✅ | ✅ | ✅ |
| `/api/employees/{id}` | DELETE | ❌ | ✅ | ✅ |

---

## Utilisation de l'API

### Endpoints Disponibles

```mermaid
graph TB
    API[API XtraWork<br/>https://localhost:7033]
    
    subgraph Auth [Authentification - /api/auth]
        R[POST /register<br/>Inscription]
        L[POST /login<br/>Connexion]
        V[POST /validate<br/>Valider Token]
        M[GET /me<br/>Info User]
    end
    
    subgraph Titles [Gestion Postes - /api/titles]
        TG[GET /<br/>Lister tous]
        TGI[GET /:id<br/>Un poste]
        TP[POST /<br/>Créer]
        TPU[PUT /:id<br/>Modifier]
        TD[DELETE /:id<br/>Supprimer]
    end
    
    subgraph Employees [Gestion Employés - /api/employees]
        EG[GET /<br/>Lister tous]
        EGI[GET /:id<br/>Un employé]
        EP[POST /<br/>Créer]
        EPU[PUT /:id<br/>Modifier]
        ED[DELETE /:id<br/>Supprimer]
    end
    
    Health[GET /health<br/>Status API]
    
    API --> Auth
    API --> Titles
    API --> Employees
    API --> Health
    
    style API fill:#4CAF50,color:#fff,stroke:#333,stroke-width:3px
    style Auth fill:#FF9800,color:#fff,stroke:#333,stroke-width:2px
    style Titles fill:#2196F3,color:#fff,stroke:#333,stroke-width:2px
    style Employees fill:#9C27B0,color:#fff,stroke:#333,stroke-width:2px
    style Health fill:#00BCD4,color:#fff,stroke:#333,stroke-width:2px
```

### 1. Inscription (Register)

**Endpoint :** `POST /api/auth/register`

**Body JSON :**
```json
{
  "username": "marie.user",
  "email": "marie@xtrawork.com",
  "password": "Marie123!",
  "firstName": "Marie",
  "lastName": "Dupont"
}
```

**Commande PowerShell :**
```powershell
$registerBody = @{
    username = "marie.user"
    email = "marie@xtrawork.com"
    password = "Marie123!"
    firstName = "Marie"
    lastName = "Dupont"
} | ConvertTo-Json

$registerResponse = Invoke-RestMethod `
    -Uri "https://localhost:7033/api/auth/register" `
    -Method Post `
    -ContentType "application/json" `
    -Body $registerBody

# Afficher la réponse
$registerResponse
```

**Réponse (Code 200) :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "3f2504e0-4f89-41d3-9a0c-0305e82c3301",
    "username": "marie.user",
    "email": "marie@xtrawork.com",
    "role": "User",
    "firstName": "Marie",
    "lastName": "Dupont"
  }
}
```

**Sauvegarder le token :**
```powershell
$token = $registerResponse.token
```

### 2. Connexion (Login)

**Endpoint :** `POST /api/auth/login`

**Body JSON :**
```json
{
  "username": "marie.user",
  "password": "Marie123!"
}
```

**Commande PowerShell :**
```powershell
$loginBody = @{
    username = "marie.user"
    password = "Marie123!"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod `
    -Uri "https://localhost:7033/api/auth/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body $loginBody

$token = $loginResponse.token
Write-Host "Token reçu : $($token.Substring(0,50))..."
```

### 3. Obtenir les Informations de l'Utilisateur Connecté

**Endpoint :** `GET /api/auth/me`

**Headers :** `Authorization: Bearer {token}`

**Commande PowerShell :**
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

$meResponse = Invoke-RestMethod `
    -Uri "https://localhost:7033/api/auth/me" `
    -Headers $headers

Write-Host "Utilisateur: $($meResponse.username)"
Write-Host "Email: $($meResponse.email)"
Write-Host "Rôle: $($meResponse.role)"
```

### 4. Créer un Titre (Poste)

**Endpoint :** `POST /api/titles`

**Permissions :** Manager ou Admin

**Body JSON :**
```json
{
  "description": "Développeur Full Stack"
}
```

**Commande PowerShell :**
```powershell
# Créer un header avec le token
$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}

$titleBody = @{
    description = "Développeur Full Stack"
} | ConvertTo-Json

$titleResponse = Invoke-RestMethod `
    -Uri "https://localhost:7033/api/titles" `
    -Method Post `
    -Headers $headers `
    -Body $titleBody

# Sauvegarder l'ID du titre
$titleId = $titleResponse.id
Write-Host "Titre créé avec ID: $titleId"
```

### 5. Lister Tous les Titres

**Endpoint :** `GET /api/titles`

**Permissions :** Tous les rôles

**Commande PowerShell :**
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

$titles = Invoke-RestMethod `
    -Uri "https://localhost:7033/api/titles" `
    -Headers $headers

# Afficher sous forme de tableau
$titles | Format-Table -Property id, description, createdAt
```

### 6. Créer un Employé

**Endpoint :** `POST /api/employees`

**Permissions :** Tous les rôles

**Body JSON :**
```json
{
  "firstName": "Pierre",
  "lastName": "Durand",
  "birthDate": "1990-03-15",
  "gender": "M",
  "titleId": "7f8a9b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c"
}
```

**Commande PowerShell :**
```powershell
$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}

$employeeBody = @{
    firstName = "Pierre"
    lastName = "Durand"
    birthDate = "1990-03-15"
    gender = "M"
    titleId = $titleId
} | ConvertTo-Json

$employeeResponse = Invoke-RestMethod `
    -Uri "https://localhost:7033/api/employees" `
    -Method Post `
    -Headers $headers `
    -Body $employeeBody

$employeeId = $employeeResponse.id
Write-Host "Employé créé avec ID: $employeeId"
```

### 7. Lister Tous les Employés

**Endpoint :** `GET /api/employees`

**Commande PowerShell :**
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

$employees = Invoke-RestMethod `
    -Uri "https://localhost:7033/api/employees" `
    -Headers $headers

# Afficher sous forme de tableau
$employees | Format-Table -Property firstName, lastName, age, gender, titleDescription
```

### 8. Modifier un Employé

**Endpoint :** `PUT /api/employees/{id}`

**Commande PowerShell :**
```powershell
$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}

$updateBody = @{
    firstName = "Pierre"
    lastName = "Durand-Martin"
    birthDate = "1990-03-15"
    gender = "M"
    titleId = $titleId
} | ConvertTo-Json

$updatedEmployee = Invoke-RestMethod `
    -Uri "https://localhost:7033/api/employees/$employeeId" `
    -Method Put `
    -Headers $headers `
    -Body $updateBody

Write-Host "Employé modifié : $($updatedEmployee.lastName)"
```

### 9. Supprimer un Employé

**Endpoint :** `DELETE /api/employees/{id}`

**Permissions :** Manager ou Admin

**Commande PowerShell :**
```powershell
$headers = @{
    Authorization = "Bearer $managerToken"
}

Invoke-RestMethod `
    -Uri "https://localhost:7033/api/employees/$employeeId" `
    -Method Delete `
    -Headers $headers

Write-Host "Employé supprimé"
```

---

## Tests Complets

### Scénario de Test Complet

```mermaid
graph TD
    Start([Début]) --> Step1[1. Démarrer l'API]
    Step1 --> Step2[2. Créer 3 utilisateurs]
    Step2 --> Step3[3. Changer les rôles en SQL]
    Step3 --> Step4[4. Se reconnecter]
    Step4 --> Step5[5. Créer des Titles]
    Step5 --> Step6[6. Créer des Employees]
    Step6 --> Step7[7. Tester les permissions]
    Step7 --> Step8[8. Tester la validation]
    Step8 --> End([Fin])
    
    style Start fill:#4CAF50,color:#fff
    style End fill:#2196F3,color:#fff
```

### Script de Test Automatique

Voici un script PowerShell complet pour tester toute l'API :

```powershell
# ============================================
# SCRIPT DE TEST COMPLET - API XtraWork
# ============================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  TESTS AUTOMATIQUES API XtraWork" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Variables globales
$baseUrl = "https://localhost:7033"
$testsPassed = 0
$testsFailed = 0

# Fonction helper pour les tests
function Test-Endpoint {
    param(
        [string]$Name,
        [scriptblock]$Test
    )
    
    Write-Host "`nTest: $Name" -ForegroundColor Yellow
    try {
        & $Test
        $script:testsPassed++
        Write-Host "PASSED" -ForegroundColor Green
    } catch {
        $script:testsFailed++
        Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# TEST 1 : Health Check
Test-Endpoint -Name "Health Check" -Test {
    $response = Invoke-WebRequest -Uri "$baseUrl/health"
    if ($response.StatusCode -ne 200) {
        throw "Status code attendu : 200, reçu : $($response.StatusCode)"
    }
}

# TEST 2 : Inscription User
Test-Endpoint -Name "Inscription User" -Test {
    $body = @{
        username = "test.user"
        email = "test@test.com"
        password = "Test123!"
        firstName = "Test"
        lastName = "User"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod `
        -Uri "$baseUrl/api/auth/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body
    
    $script:userToken = $response.token
    
    if ([string]::IsNullOrEmpty($script:userToken)) {
        throw "Token non reçu"
    }
}

# TEST 3 : Login
Test-Endpoint -Name "Login" -Test {
    $body = @{
        username = "test.user"
        password = "Test123!"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod `
        -Uri "$baseUrl/api/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body
    
    if ([string]::IsNullOrEmpty($response.token)) {
        throw "Token non reçu"
    }
}

# TEST 4 : Get Me
Test-Endpoint -Name "Get Current User" -Test {
    $headers = @{ Authorization = "Bearer $script:userToken" }
    $response = Invoke-RestMethod `
        -Uri "$baseUrl/api/auth/me" `
        -Headers $headers
    
    if ($response.username -ne "test.user") {
        throw "Username incorrect"
    }
}

# TEST 5 : Créer un Title (doit échouer pour User)
Test-Endpoint -Name "Create Title (User - doit échouer)" -Test {
    $headers = @{
        Authorization = "Bearer $script:userToken"
        "Content-Type" = "application/json"
    }
    $body = @{ description = "Test Title" } | ConvertTo-Json
    
    try {
        Invoke-RestMethod `
            -Uri "$baseUrl/api/titles" `
            -Method Post `
            -Headers $headers `
            -Body $body
        throw "User ne devrait pas pouvoir créer un titre"
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -ne 403) {
            throw "Code attendu : 403, reçu : $($_.Exception.Response.StatusCode.value__)"
        }
    }
}

# RÉSUMÉ
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  RÉSUMÉ DES TESTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Tests réussis: $testsPassed" -ForegroundColor Green
Write-Host "Tests échoués: $testsFailed" -ForegroundColor $(if ($testsFailed -eq 0) { "Green" } else { "Red" })
Write-Host "`n" -ForegroundColor Cyan
```

---

## Dépannage

### Problème : Port Déjà Utilisé

**Erreur :**
```
Failed to bind to address http://127.0.0.1:5280: address already in use
```

**Solution :**
```powershell
# Arrêter tous les processus dotnet
Get-Process -Name "dotnet" | Stop-Process -Force

# Attendre 2 secondes
Start-Sleep -Seconds 2

# Relancer l'API
cd C:\Users\rehou\Downloads\2-SuiviEtudiantsEtape2\SuiviEtudiantsEtape2\XtraWork
dotnet run
```

### Problème : Base de Données non Créée

**Erreur :**
```
Invalid object name 'Users'
```

**Solution :**
```powershell
# Supprimer la base
sqlcmd -S LAPTOP-81IAD844 -E -Q "DROP DATABASE IF EXISTS XtraWork;"

# Relancer l'API (créera automatiquement la base)
dotnet run
```

### Problème : Erreur de Connexion SQL

**Erreur :**
```
A network-related or instance-specific error occurred
```

**Vérifications :**

1. **SQL Server est démarré ?**
```powershell
Get-Service -Name "MSSQLSERVER"
```

2. **Nom du serveur correct ?**
```powershell
sqlcmd -L
```

3. **Tester la connexion :**
```powershell
sqlcmd -S LAPTOP-81IAD844 -E -Q "SELECT @@VERSION"
```

### Problème : Token Invalide

**Erreur :**
```
401 Unauthorized
```

**Solutions :**

1. **Vérifier que le token n'est pas expiré** (durée : 1 heure)
2. **Reconnecter :**
```powershell
$loginBody = @{
    username = "marie.user"
    password = "Marie123!"
} | ConvertTo-Json

$response = Invoke-RestMethod `
    -Uri "https://localhost:7033/api/auth/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body $loginBody

$token = $response.token
```

### Diagramme de Dépannage

```mermaid
graph TD
    Problem{Problème ?}
    
    Problem -->|API ne démarre pas| P1[Vérifier port occupé]
    Problem -->|Erreur 500| P2[Vérifier base de données]
    Problem -->|Erreur 401| P3[Vérifier token]
    Problem -->|Erreur 403| P4[Vérifier permissions]
    
    P1 --> S1[Arrêter processus dotnet]
    P2 --> S2[Recréer la base]
    P3 --> S3[Reconnecter]
    P4 --> S4[Vérifier rôle utilisateur]
    
    style Problem fill:#FF9800,color:#fff
    style S1 fill:#4CAF50,color:#fff
    style S2 fill:#4CAF50,color:#fff
    style S3 fill:#4CAF50,color:#fff
    style S4 fill:#4CAF50,color:#fff
```

---

## FAQ

### Q1 : Qu'est-ce qu'une API REST ?

**R :** Une API REST (Representational State Transfer) est un style d'architecture pour les services web qui utilise les méthodes HTTP standard (GET, POST, PUT, DELETE) pour effectuer des opérations sur des ressources.

**Analogie :** C'est comme un serveur dans un restaurant :
- **GET** : "Je veux voir le menu" (lire)
- **POST** : "Je commande ce plat" (créer)
- **PUT** : "Je modifie ma commande" (modifier)
- **DELETE** : "J'annule ce plat" (supprimer)

### Q2 : Pourquoi utiliser Entity Framework ?

**R :** Entity Framework (EF) est un ORM (Object-Relational Mapper) qui :
- Traduit automatiquement vos classes C# en tables SQL
- Génère les requêtes SQL pour vous
- Gère les relations entre tables

**Sans EF :**
```csharp
// Écrire du SQL manuellement
string sql = "SELECT * FROM Employees WHERE Id = @id";
SqlCommand cmd = new SqlCommand(sql, connection);
cmd.Parameters.AddWithValue("@id", employeeId);
// ... beaucoup de code boilerplate
```

**Avec EF :**
```csharp
// Code simple et lisible
var employee = await _context.Employees.FindAsync(employeeId);
```

### Q3 : C'est quoi un GUID/UNIQUEIDENTIFIER ?

**R :** Un GUID (Globally Unique Identifier) est un identifiant unique universel de 128 bits.

**Format :** `3F2504E0-4F89-41D3-9A0C-0305E82C3301`

**Avantages :**
- Unique dans le monde entier (probabilité de collision quasi nulle)
- Peut être généré côté client
- Facilite la réplication de bases de données

**Comparé à un INT :**
- INT : 1, 2, 3, 4... (prévisible, collision possible)
- GUID : Totalement unique et imprévisible

### Q4 : Comment fonctionne le hachage de mot de passe ?

**R :** Le hachage transforme un mot de passe en une chaîne illisible et irréversible.

```mermaid
graph LR
    Password[Mot de passe:<br/>Marie123!]
    Hash[BCrypt]
    Hashed[Hash:<br/>$2a$11$Xv8pqKl...]
    
    Password --> Hash
    Hash --> Hashed
    
    style Password fill:#FFE082,color:#000,stroke:#333,stroke-width:2px
    style Hashed fill:#80DEEA,color:#000,stroke:#333,stroke-width:2px
```

**Propriétés :**
- **Irréversible** : On ne peut pas retrouver le mot de passe original
- **Déterministe** : Même mot de passe = même hash
- **Unique** : Deux mots de passe différents = hashes différents

### Q5 : Quelle est la différence entre Authenticate et Authorize ?

**Authentication (Authentification) :**
- "Qui es-tu ?"
- Vérifier l'identité (login/password)
- Obtenir un token JWT

**Authorization (Autorisation) :**
- "Que peux-tu faire ?"
- Vérifier les permissions (rôle)
- Accorder ou refuser l'accès

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant A as Authentication
    participant Auth as Authorization
    participant R as Ressource

    U->>A: Login + Password
    A-->>U: Token JWT (authentifié)
    U->>Auth: Requête + Token
    Auth->>Auth: Vérifier rôle
    Auth-->>R: Accès autorisé
    R-->>U: Ressource
```

### Q6 : Comment changer le port de l'API ?

**R :** Modifier le fichier `Properties/launchSettings.json` :

```json
{
  "profiles": {
    "https": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": true,
      "launchUrl": "swagger",
      "applicationUrl": "https://localhost:7033;http://localhost:5280",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    }
  }
}
```

Changer `7033` et `5280` par vos ports souhaités.

### Q7 : Comment voir les logs en production ?

**R :** Les logs sont dans le dossier `logs/` :

```powershell
# Voir les dernières lignes
Get-Content "logs/xtrawork-20250930.txt" -Tail 50

# Suivre en temps réel
Get-Content "logs/xtrawork-20250930.txt" -Wait
```

### Q8 : Peut-on utiliser MySQL au lieu de SQL Server ?

**R :** Oui ! Modifier dans `XtraWork.csproj` :

```xml
<!-- Remplacer -->
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0" />

<!-- Par -->
<PackageReference Include="Pomelo.EntityFrameworkCore.MySql" Version="8.0.0" />
```

Et dans `Program.cs` :

```csharp
// Remplacer
builder.Services.AddDbContext<XtraWorkContext>(opt => 
    opt.UseSqlServer(connectionString));

// Par
builder.Services.AddDbContext<XtraWorkContext>(opt => 
    opt.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));
```

---

## Annexes

### Codes HTTP Importants

| Code | Nom | Signification |
|------|-----|---------------|
| **200** | OK | Requête réussie |
| **201** | Created | Ressource créée avec succès |
| **204** | No Content | Suppression réussie |
| **400** | Bad Request | Données invalides (validation) |
| **401** | Unauthorized | Non authentifié (token manquant) |
| **403** | Forbidden | Non autorisé (pas les droits) |
| **404** | Not Found | Ressource introuvable |
| **500** | Internal Server Error | Erreur serveur |

### Glossaire

| Terme | Définition |
|-------|------------|
| **API** | Application Programming Interface - interface pour communiquer avec un logiciel |
| **REST** | Representational State Transfer - style d'architecture pour les API |
| **JWT** | JSON Web Token - format de token pour l'authentification |
| **ORM** | Object-Relational Mapping - traduction objet ↔ base de données |
| **Entity** | Classe C# représentant une table de base de données |
| **Repository** | Couche d'accès aux données |
| **Service** | Couche de logique métier |
| **Controller** | Point d'entrée de l'API (endpoint) |
| **DTO** | Data Transfer Object - objet pour transférer des données |
| **GUID** | Globally Unique Identifier - identifiant unique universel |
| **CRUD** | Create, Read, Update, Delete - opérations de base |

### Commandes Essentielles Résumées

```powershell
# Démarrer l'API
cd C:\Users\rehou\Downloads\2-SuiviEtudiantsEtape2\SuiviEtudiantsEtape2\XtraWork
dotnet run

# Arrêter l'API
Get-Process -Name "dotnet" | Stop-Process -Force

# Tester health check
Invoke-WebRequest -Uri "https://localhost:7033/health"

# Ouvrir Swagger
Start-Process "https://localhost:7033/swagger/index.html"

# Voir la base de données
sqlcmd -S LAPTOP-81IAD844 -E -Q "USE XtraWork; SELECT * FROM Users;"

# Supprimer la base
sqlcmd -S LAPTOP-81IAD844 -E -Q "DROP DATABASE IF EXISTS XtraWork;"
```

---

## Conclusion

Félicitations ! Vous avez maintenant :

✅ Compris l'architecture de l'API  
✅ Maîtrisé le schéma de base de données  
✅ Appris à utiliser tous les endpoints  
✅ Testé l'authentification et les autorisations  
✅ Résolu les problèmes courants

**Prochaines étapes suggérées :**
1. Créer une interface web (Angular, React, Vue.js)
2. Déployer sur Azure ou AWS
3. Ajouter des tests unitaires
4. Implémenter la pagination
5. Ajouter des filtres de recherche

**Ressources supplémentaires :**
- Documentation ASP.NET Core : https://docs.microsoft.com/aspnet/core
- Entity Framework Core : https://docs.microsoft.com/ef/core
- JWT.io : https://jwt.io
- Swagger : https://swagger.io

---

**Document créé le :** 30 septembre 2025  
**Version :** 1.0  
**Auteur :** Guide Complet pour Débutants  
**Projet :** XtraWork API
