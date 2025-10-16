# Guide Visuel - XtraWork Application

Guide visuel pour comprendre rapidement l'architecture et le flow de l'application.

---

## Architecture Globale

```
┌─────────────────────────────────────────────────────────────┐
│                    UTILISATEUR                              │
│                    Navigateur Web                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND (Next.js 14)                          │
│              Port: 3000                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Pages   │  │Components│  │ Services │  │  Store   │   │
│  │  (UI)    │→ │   (UI)   │→ │  (API)   │→ │ (State)  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│       │             │              │              │         │
│       └─────────────┴──────────────┴──────────────┘         │
│                          │                                  │
│                    Axios HTTP Client                        │
│                    + JWT Interceptor                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ HTTPS + Bearer Token
                           │
┌──────────────────────────▼──────────────────────────────────┐
│            BACKEND (ASP.NET Core 8)                         │
│            Port: 7033                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Controllers│→│ Services │→│Repositories│→│ EF Core  │   │
│  │ (Endpoints)│ │(Business)│ │  (Data)  │ │  (ORM)   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│       │             │              │              │         │
│       └─────────────┴──────────────┴──────────────┘         │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │   SQL Server     │
                  │   Database       │
                  │   XtraWork       │
                  └──────────────────┘
```

---

## Flow d'Authentification

```
┌─────────────────────────────────────────────────────────────┐
│ ÉTAPE 1 : LOGIN                                             │
└─────────────────────────────────────────────────────────────┘

Utilisateur                Frontend              Backend
    │                         │                     │
    │──1. Entrer credentials─►│                     │
    │   username: "admin"     │                     │
    │   password: "Admin123!" │                     │
    │                         │                     │
    │                         │──2. POST /auth/login─►
    │                         │   { username, pwd } │
    │                         │                     │
    │                         │                     │──3. Vérifier
    │                         │                     │   mot de passe
    │                         │                     │
    │                         │                     │──4. Générer
    │                         │                     │   JWT Token
    │                         │                     │
    │                         │◄──5. Return token───│
    │                         │   { token, user }   │
    │                         │                     │
    │                         │──6. Stocker         │
    │                         │   localStorage      │
    │                         │   - token           │
    │                         │   - user info       │
    │                         │                     │
    │◄──7. Redirect dashboard─│                     │
    │                         │                     │


┌─────────────────────────────────────────────────────────────┐
│ ÉTAPE 2 : REQUÊTES AUTHENTIFIÉES                            │
└─────────────────────────────────────────────────────────────┘

Utilisateur                Frontend              Backend
    │                         │                     │
    │──1. Clic "Employés"────►│                     │
    │                         │                     │
    │                         │──2. GET /employees──►
    │                         │   Headers:          │
    │                         │   Authorization:    │
    │                         │   Bearer {token}    │
    │                         │                     │
    │                         │                     │──3. Valider
    │                         │                     │   JWT Token
    │                         │                     │
    │                         │                     │──4. Extraire
    │                         │                     │   User Claims
    │                         │                     │
    │                         │                     │──5. Query DB
    │                         │                     │
    │                         │◄──6. Return data────│
    │                         │   [ employees... ]  │
    │                         │                     │
    │◄──7. Afficher liste────│                     │
    │                         │                     │
```

---

## Structure des Dossiers (Détaillée)

```
projet/
│
├── XtraWork/                         # BACKEND
│   │
│   ├── Controllers/                  # Endpoints API
│   │   ├── AuthController.cs        # Login, Register, Logout
│   │   ├── EmployeeController.cs    # CRUD Employés
│   │   └── TitleController.cs       # CRUD Titres
│   │
│   ├── Services/                     # Business Logic
│   │   ├── AuthService.cs           # Logique authentification
│   │   ├── EmployeeService.cs       # Logique employés
│   │   └── TitleService.cs          # Logique titres
│   │
│   ├── Repositories/                 # Data Access
│   │   ├── UserRepository.cs        # Accès Users
│   │   ├── EmployeeRepository.cs    # Accès Employees
│   │   ├── TitleRepository.cs       # Accès Titles
│   │   └── XtraWorkContext.cs       # DbContext EF Core
│   │
│   ├── Entities/                     # Database Models
│   │   ├── User.cs                  # Modèle User
│   │   ├── Employee.cs              # Modèle Employee
│   │   └── Title.cs                 # Modèle Title
│   │
│   ├── Requests/                     # DTOs Input
│   │   ├── LoginRequest.cs
│   │   ├── RegisterRequest.cs
│   │   ├── EmployeeRequest.cs
│   │   └── TitleRequest.cs
│   │
│   ├── Responses/                    # DTOs Output
│   │   ├── AuthResponse.cs
│   │   ├── EmployeeResponse.cs
│   │   └── TitleResponse.cs
│   │
│   ├── Validators/                   # FluentValidation
│   ├── Exceptions/                   # Custom Exceptions
│   ├── Program.cs                    # Configuration
│   └── appsettings.json              # Settings
│
│
├── frontend/                         # FRONTEND
│   │
│   ├── src/
│   │   │
│   │   ├── app/                      # Pages (App Router)
│   │   │   ├── layout.tsx           # Layout principal
│   │   │   ├── page.tsx             # Home page
│   │   │   ├── globals.css          # Styles globaux
│   │   │   │
│   │   │   ├── auth/                # Authentification
│   │   │   │   ├── login/page.tsx   # Page login
│   │   │   │   └── register/page.tsx # Page register
│   │   │   │
│   │   │   └── dashboard/           # Pages protégées
│   │   │       ├── page.tsx         # Dashboard
│   │   │       ├── employees/       # Gestion employés
│   │   │       └── titles/          # Gestion titres
│   │   │
│   │   ├── components/              # Composants UI
│   │   │   └── ui/                  # Composants de base
│   │   │
│   │   ├── services/                # Services API
│   │   │   ├── auth.service.ts      # Service auth
│   │   │   ├── employee.service.ts  # Service employees
│   │   │   ├── title.service.ts     # Service titles
│   │   │   └── index.ts             # Export
│   │   │
│   │   ├── types/                   # TypeScript Types
│   │   │   └── index.ts             # Types globaux
│   │   │
│   │   ├── lib/                     # Utilitaires
│   │   │   ├── api-client.ts        # Client Axios
│   │   │   └── utils.ts             # Fonctions utils
│   │   │
│   │   ├── hooks/                   # Custom Hooks
│   │   │   └── useAuth.ts           # Hook auth
│   │   │
│   │   ├── store/                   # State Management
│   │   │   └── auth.store.ts        # Store Zustand
│   │   │
│   │   └── middleware.ts            # Route protection
│   │
│   ├── public/                      # Fichiers statiques
│   ├── package.json                 # Dependencies
│   ├── tsconfig.json                # TypeScript config
│   ├── tailwind.config.ts           # Tailwind config
│   ├── next.config.mjs              # Next.js config
│   └── .env.local                   # Environment vars
│
│
└── Documentation/
    ├── README.md                    # Vue d'ensemble
    ├── DEMARRAGE-RAPIDE.md          # Guide démarrage
    ├── GUIDE-FRONTEND-BACKEND.md    # Guide technique
    └── GUIDE-VISUEL.md              # Ce fichier
```

---

## Flow d'une Requête Complète

```
┌──────────────────────────────────────────────────────────────┐
│ Exemple : Afficher la liste des employés                    │
└──────────────────────────────────────────────────────────────┘

┌─────────────┐
│ 1. USER     │  Clic sur "Employés"
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│ 2. COMPONENT (EmployeesPage.tsx)   │
│                                     │
│  useEffect(() => {                  │
│    loadEmployees();                 │
│  }, []);                            │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ 3. SERVICE (employee.service.ts)    │
│                                     │
│  async getAll() {                   │
│    return await get('/employees');  │
│  }                                  │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ 4. API CLIENT (api-client.ts)      │
│                                     │
│  Interceptor ajoute:                │
│  Authorization: Bearer {token}      │
│                                     │
│  axios.get('/employees')            │
└──────┬──────────────────────────────┘
       │
       │ HTTPS Request
       │
       ▼
┌─────────────────────────────────────┐
│ 5. CONTROLLER (EmployeeController)  │
│                                     │
│  [HttpGet]                          │
│  [Authorize]                        │
│  public async Task<...> GetAll()    │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ 6. JWT MIDDLEWARE                   │
│                                     │
│  - Valider token                    │
│  - Extraire claims (UserId, Role)   │
│  - Passer au controller             │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ 7. SERVICE (EmployeeService)        │
│                                     │
│  public async Task<...> GetAll()    │
│  {                                  │
│    var employees = await            │
│      _repo.GetAll();                │
│    return Map(employees);           │
│  }                                  │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ 8. REPOSITORY (EmployeeRepository)  │
│                                     │
│  public async Task<...> GetAll()    │
│  {                                  │
│    return await _context            │
│      .Employees                     │
│      .Include(e => e.Title)         │
│      .ToListAsync();                │
│  }                                  │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ 9. ENTITY FRAMEWORK CORE            │
│                                     │
│  SELECT * FROM Employees e          │
│  LEFT JOIN Titles t                 │
│    ON e.TitleId = t.Id              │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ 10. SQL SERVER DATABASE             │
│                                     │
│  Exécution de la requête SQL        │
│  Retour des données                 │
└──────┬──────────────────────────────┘
       │
       │ Response remonte
       ▼
┌─────────────────────────────────────┐
│ COMPONENT reçoit les données        │
│                                     │
│  setEmployees(data);                │
│                                     │
│  Render de la liste                 │
└─────────────────────────────────────┘
```

---

## JWT Token Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. CRÉATION DU TOKEN (Backend)                              │
└─────────────────────────────────────────────────────────────┘

User credentials
     ↓
Vérification password (BCrypt)
     ↓
Création des Claims:
  - NameIdentifier: userId
  - Name: username
  - Email: email
  - Role: role
     ↓
Signature avec clé secrète (HMACSHA256)
     ↓
Token JWT généré:
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
  eyJuYW1laWQiOiIxMjMiLCJ1bmlxdWVfbmFtZSI6ImFkbWluIiwicm9sZSI6IkFkbWluIiwiZXhwIjoxNzE...
  .signature
     ↓
Retour au frontend


┌─────────────────────────────────────────────────────────────┐
│ 2. STOCKAGE DU TOKEN (Frontend)                             │
└─────────────────────────────────────────────────────────────┘

Token reçu
     ↓
localStorage.setItem('token', token)
     ↓
Zustand store update:
  - user: { ... }
  - token: "eyJhbG..."
  - isAuthenticated: true


┌─────────────────────────────────────────────────────────────┐
│ 3. UTILISATION DU TOKEN (Frontend → Backend)                │
└─────────────────────────────────────────────────────────────┘

Requête API
     ↓
Axios Interceptor:
  config.headers.Authorization = `Bearer ${token}`
     ↓
Request envoyée avec header:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...


┌─────────────────────────────────────────────────────────────┐
│ 4. VALIDATION DU TOKEN (Backend)                            │
└─────────────────────────────────────────────────────────────┘

Request reçue avec token
     ↓
JWT Middleware:
  - Extraire token du header Authorization
  - Vérifier signature avec clé secrète
  - Vérifier expiration
  - Vérifier issuer & audience
     ↓
Si valide:
  - Extraire claims
  - Créer ClaimsPrincipal
  - Injecter dans HttpContext.User
     ↓
Controller peut accéder:
  - User.FindFirst(ClaimTypes.NameIdentifier)
  - User.FindFirst(ClaimTypes.Role)
     ↓
Autorisation vérifiée:
  - [Authorize] → User authentifié
  - [Authorize(Roles = "Admin")] → User est Admin
```

---

## Diagramme des Rôles et Permissions

```
┌─────────────────────────────────────────────────────────────┐
│                    HIÉRARCHIE DES RÔLES                     │
└─────────────────────────────────────────────────────────────┘

                    ┌─────────────┐
                    │    ADMIN    │  ← Tous les droits
                    │             │
                    │  ✓ Create   │
                    │  ✓ Read     │
                    │  ✓ Update   │
                    │  ✓ Delete   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   MANAGER   │  ← Droits étendus
                    │             │
                    │  ✓ Create   │
                    │  ✓ Read     │
                    │  ✓ Update   │
                    │  ✓ Delete   │  (Employees seulement)
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │    USER     │  ← Droits basiques
                    │             │
                    │  ✓ Create   │  (Employees)
                    │  ✓ Read     │
                    │  ✗ Update   │
                    │  ✗ Delete   │
                    └─────────────┘


┌─────────────────────────────────────────────────────────────┐
│                  PERMISSIONS PAR ENDPOINT                    │
└─────────────────────────────────────────────────────────────┘

ENDPOINT                          USER    MANAGER   ADMIN
─────────────────────────────────────────────────────────────
Auth
  POST /auth/login                 ✓        ✓        ✓
  POST /auth/register              ✓        ✓        ✓
  GET  /auth/me                    ✓        ✓        ✓

Employees
  GET  /employees                  ✓        ✓        ✓
  GET  /employees/{id}             ✓        ✓        ✓
  POST /employees                  ✓        ✓        ✓
  PUT  /employees/{id}             ✓        ✓        ✓
  DELETE /employees/{id}           ✗        ✓        ✓

Titles
  GET  /titles                     ✓        ✓        ✓
  GET  /titles/{id}                ✓        ✓        ✓
  POST /titles                     ✗        ✗        ✓
  PUT  /titles/{id}                ✗        ✓        ✓
  DELETE /titles/{id}              ✗        ✗        ✓
```

---

## Pages et Navigation

```
┌─────────────────────────────────────────────────────────────┐
│                    PLAN DU SITE                             │
└─────────────────────────────────────────────────────────────┘

/ (Home)
   │
   ├─► /auth/login (Login)
   │
   ├─► /auth/register (Register)
   │
   └─► /dashboard (Protected) ────┐
                                  │
         ┌────────────────────────┘
         │
         ├─► /dashboard/employees
         │      │
         │      ├─► /dashboard/employees/create (À créer)
         │      ├─► /dashboard/employees/{id} (À créer)
         │      └─► /dashboard/employees/{id}/edit (À créer)
         │
         ├─► /dashboard/titles (À créer)
         │      │
         │      ├─► /dashboard/titles/create (À créer)
         │      ├─► /dashboard/titles/{id} (À créer)
         │      └─► /dashboard/titles/{id}/edit (À créer)
         │
         └─► /dashboard/profile (À créer)
```

---

Votre application est prête à être utilisée et étendue.

