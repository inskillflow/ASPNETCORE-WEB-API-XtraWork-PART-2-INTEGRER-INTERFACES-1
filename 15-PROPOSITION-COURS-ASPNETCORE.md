# Proposition - Structure de Cours ASP.NET Core

## Problème identifié

Le dossier `14-documentation-2-cours/` est orienté :
- Next.js
- Clerk/NextAuth
- Frontend React

**Mais votre projet XtraWork est** :
- ASP.NET Core
- JWT custom
- API REST

---

## Proposition de structure de cours pour ASP.NET Core

### Organisation suggérée : 15-cours-aspnetcore/

```
15-cours-aspnetcore/
│
├── README.md                              # Vue d'ensemble
├── GUIDE-PROGRESSION(COURS).md            # Parcours pédagogique
├── COMPARAISON-APPROCHES(COURS).md        # JWT vs Identity vs IdentityServer
│
├── 01-fondations-aspnetcore/
│   ├── 00-INTRODUCTION(COURS).md
│   ├── 01-ARCHITECTURE-CLEAN(COURS).md    # Controllers → Services → Repositories
│   ├── 02-ENTITY-FRAMEWORK(COURS).md      # ORM, DbContext, Migrations
│   ├── 03-DEPENDENCY-INJECTION(COURS).md  # DI dans ASP.NET Core
│   ├── 04-QUIZ-QUESTIONS(OBLIGATOIRE).md
│   ├── 05-QUIZ-REPONSES(OBLIGATOIRE).md
│   ├── 06-EXERCICES(OPTIONNEL).md
│   └── INDEX.md
│
├── 02-jwt-authentification/
│   ├── 00-INTRODUCTION(COURS).md
│   ├── 01-JWT-FONDATIONS(COURS).md        # Anatomie JWT, Claims, Signing
│   ├── 02-IMPLEMENTATION-ASPNET(COURS).md # AddAuthentication, JwtBearer
│   ├── 03-GENERER-TOKENS(COURS).md        # JwtSecurityTokenHandler
│   ├── 04-VALIDER-TOKENS(COURS).md        # [Authorize], Claims, Policies
│   ├── 05-REFRESH-TOKENS(COURS).md        # Renouvellement sécurisé
│   ├── 06-SECURITE(COURS).md              # Bonnes pratiques
│   ├── 07-QUIZ-QUESTIONS(OBLIGATOIRE).md
│   ├── 08-QUIZ-REPONSES(OBLIGATOIRE).md
│   ├── 09-EXERCICES(OPTIONNEL).md
│   └── INDEX.md
│
├── 03-api-rest-controllers/
│   ├── 00-INTRODUCTION(COURS).md
│   ├── 01-ROUTING(COURS).md               # [Route], [HttpGet], [HttpPost]
│   ├── 02-MODEL-BINDING(COURS).md         # [FromBody], [FromRoute], [FromQuery]
│   ├── 03-VALIDATION(COURS).md            # FluentValidation, DataAnnotations
│   ├── 04-REPONSES-HTTP(COURS).md         # Ok(), NotFound(), CreatedAtAction()
│   ├── 05-GESTION-ERREURS(COURS).md       # Middleware, Exceptions
│   ├── 06-QUIZ-QUESTIONS(OBLIGATOIRE).md
│   ├── 07-QUIZ-REPONSES(OBLIGATOIRE).md
│   ├── 08-EXERCICES(OPTIONNEL).md
│   └── INDEX.md
│
├── 04-services-repositories/
│   ├── 00-INTRODUCTION(COURS).md
│   ├── 01-PATTERN-SERVICE(COURS).md       # Logique métier séparée
│   ├── 02-PATTERN-REPOSITORY(COURS).md    # Accès données
│   ├── 03-UNIT-OF-WORK(COURS).md          # Transactions
│   ├── 04-ASYNC-AWAIT(COURS).md           # Programmation asynchrone
│   ├── 05-QUIZ-QUESTIONS(OBLIGATOIRE).md
│   ├── 06-QUIZ-REPONSES(OBLIGATOIRE).md
│   ├── 07-EXERCICES(OPTIONNEL).md
│   └── INDEX.md
│
├── 05-dtos-mapping/
│   ├── 00-INTRODUCTION(COURS).md
│   ├── 01-POURQUOI-DTOS(COURS).md         # Séparation entités/API
│   ├── 02-REQUESTS-RESPONSES(COURS).md    # DTOs entrée/sortie
│   ├── 03-AUTOMAPPER(COURS).md            # Mapping automatique
│   ├── 04-QUIZ-QUESTIONS(OBLIGATOIRE).md
│   ├── 05-QUIZ-REPONSES(OBLIGATOIRE).md
│   ├── 06-EXERCICES(OPTIONNEL).md
│   └── INDEX.md
│
├── 06-cors-securite/
│   ├── 00-INTRODUCTION(COURS).md
│   ├── 01-COMPRENDRE-CORS(COURS).md       # Same-origin, preflight
│   ├── 02-CONFIGURATION-ASPNET(COURS).md  # AddCors, UseCors
│   ├── 03-SECURITE-API(COURS).md          # HTTPS, rate limiting
│   ├── 04-QUIZ-QUESTIONS(OBLIGATOIRE).md
│   ├── 05-QUIZ-REPONSES(OBLIGATOIRE).md
│   ├── 06-EXERCICES(OPTIONNEL).md
│   └── INDEX.md
│
├── 07-swagger-documentation/
│   ├── 00-INTRODUCTION(COURS).md
│   ├── 01-OPENAPI-SPEC(COURS).md          # Spécification OpenAPI
│   ├── 02-SWAGGER-ASPNET(COURS).md        # Swashbuckle
│   ├── 03-DOCUMENTER-API(COURS).md        # Annotations, exemples
│   ├── 04-QUIZ-QUESTIONS(OBLIGATOIRE).md
│   ├── 05-QUIZ-REPONSES(OBLIGATOIRE).md
│   ├── 06-EXERCICES(OPTIONNEL).md
│   └── INDEX.md
│
├── 08-entity-framework-avance/
│   ├── 00-INTRODUCTION(COURS).md
│   ├── 01-MIGRATIONS(COURS).md            # Add-Migration, Update-Database
│   ├── 02-RELATIONS(COURS).md             # One-to-Many, Many-to-Many
│   ├── 03-INCLUDE-EAGER-LOADING(COURS).md # Éviter N+1
│   ├── 04-LINQ-AVANCE(COURS).md           # Where, Select, Join
│   ├── 05-QUIZ-QUESTIONS(OBLIGATOIRE).md
│   ├── 06-QUIZ-REPONSES(OBLIGATOIRE).md
│   ├── 07-EXERCICES(OPTIONNEL).md
│   └── INDEX.md
│
├── 09-testing-aspnetcore/
│   ├── 00-INTRODUCTION(COURS).md
│   ├── 01-UNIT-TESTS(COURS).md            # xUnit, Moq
│   ├── 02-INTEGRATION-TESTS(COURS).md     # WebApplicationFactory
│   ├── 03-TESTS-API(COURS).md             # Tester les endpoints
│   ├── 04-QUIZ-QUESTIONS(OBLIGATOIRE).md
│   ├── 05-QUIZ-REPONSES(OBLIGATOIRE).md
│   ├── 06-EXERCICES(OPTIONNEL).md
│   └── INDEX.md
│
└── 10-deploiement-production/
    ├── 00-INTRODUCTION(COURS).md
    ├── 01-CONFIGURATION(COURS).md         # appsettings, environnements
    ├── 02-DOCKER(COURS).md                # Containerisation
    ├── 03-AZURE(COURS).md                 # App Service, SQL Database
    ├── 04-QUIZ-QUESTIONS(OBLIGATOIRE).md
    ├── 05-QUIZ-REPONSES(OBLIGATOIRE).md
    ├── 06-EXERCICES(OPTIONNEL).md
    └── INDEX.md
```

---

## Contenu détaillé par cours

### Cours 1 : Fondations ASP.NET Core

**Sujets** :
- Architecture Clean (Controller → Service → Repository)
- Entity Framework Core (ORM, DbContext, Migrations)
- Dependency Injection (AddScoped, AddSingleton)
- Pattern Repository

**Durée** : 4-5 heures
**Quiz** : 25 questions
**Exercices** : 5 exercices pratiques

---

### Cours 2 : JWT Authentification

**Sujets** :
- Anatomie d'un JWT (header.payload.signature)
- Implémentation dans ASP.NET Core
- Génération de tokens (JwtSecurityTokenHandler)
- Validation et Claims
- Refresh tokens
- Sécurité et bonnes pratiques

**Durée** : 5-6 heures
**Quiz** : 30 questions
**Exercices** : 6 exercices

---

### Cours 3 : API REST et Controllers

**Sujets** :
- Routing ([Route], [HttpGet], [HttpPost])
- Model Binding ([FromBody], [FromRoute])
- Validation (FluentValidation, DataAnnotations)
- Réponses HTTP (Ok(), NotFound(), CreatedAtAction())
- Gestion d'erreurs globale

**Durée** : 4-5 heures
**Quiz** : 25 questions
**Exercices** : 5 exercices

---

### Cours 4 : Services et Repositories

**Sujets** :
- Pattern Service Layer
- Pattern Repository
- Unit of Work
- Async/Await
- Injection de dépendances

**Durée** : 3-4 heures
**Quiz** : 20 questions
**Exercices** : 4 exercices

---

### Cours 5 : DTOs et Mapping

**Sujets** :
- Pourquoi des DTOs (séparation Entity/API)
- Requests et Responses
- AutoMapper
- Validation des DTOs

**Durée** : 3-4 heures
**Quiz** : 20 questions
**Exercices** : 4 exercices

---

### Cours 6 : CORS et Sécurité

**Sujets** :
- Comprendre CORS (Same-origin policy)
- Configuration dans ASP.NET Core
- HTTPS et certificats
- Rate limiting
- Protection contre attaques (XSS, CSRF, SQL Injection)

**Durée** : 4-5 heures
**Quiz** : 25 questions
**Exercices** : 5 exercices

---

### Cours 7 : Swagger et Documentation

**Sujets** :
- OpenAPI Specification
- Swashbuckle dans ASP.NET Core
- Documenter vos endpoints
- Générer des clients (OpenAPI Generator)

**Durée** : 2-3 heures
**Quiz** : 15 questions
**Exercices** : 3 exercices

---

### Cours 8 : Entity Framework Avancé

**Sujets** :
- Migrations (Add-Migration, Update-Database)
- Relations (One-to-Many, Many-to-Many)
- Include et Eager Loading (éviter N+1)
- LINQ avancé
- Performance

**Durée** : 4-5 heures
**Quiz** : 25 questions
**Exercices** : 5 exercices

---

### Cours 9 : Tests

**Sujets** :
- Tests unitaires (xUnit, Moq)
- Tests d'intégration (WebApplicationFactory)
- Tester les API endpoints
- Test-Driven Development

**Durée** : 4-5 heures
**Quiz** : 20 questions
**Exercices** : 5 exercices

---

### Cours 10 : Déploiement

**Sujets** :
- Configuration (appsettings.json, environnements)
- Docker et containerisation
- Déploiement Azure (App Service, SQL Database)
- CI/CD

**Durée** : 3-4 heures
**Quiz** : 20 questions
**Exercices** : 4 exercices

---

## Statistiques de la proposition

| Métrique | Quantité |
|----------|----------|
| **Cours** | 10 |
| **Modules** | ~50 |
| **Questions quiz** | ~225 |
| **Exercices** | ~46 |
| **Durée totale** | 38-48 heures |

---

## Parcours pédagogique suggéré

### Semestre 1 : Fondamentaux (Cours 1-5)

**Semaines 1-3** : Cours 1 (Fondations)
**Semaines 4-6** : Cours 2 (JWT)
**Semaines 7-9** : Cours 3 (Controllers)
**Semaines 10-12** : Cours 4-5 (Services/DTOs)

### Semestre 2 : Avancé (Cours 6-10)

**Semaines 1-3** : Cours 6-7 (CORS/Swagger)
**Semaines 4-6** : Cours 8 (EF Advanced)
**Semaines 7-9** : Cours 9 (Tests)
**Semaines 10-12** : Cours 10 (Déploiement)

---

## Adaptation au projet XtraWork

### Basé sur le code existant

Chaque cours utilise le projet XtraWork comme exemple :

**Cours 1** : Analyse de la structure XtraWork
- Controllers/EmployeeController.cs
- Services/EmployeeService.cs
- Repositories/EmployeeRepository.cs

**Cours 2** : JWT dans XtraWork
- Program.cs (configuration JWT)
- AuthService.cs (génération tokens)
- [Authorize] dans les controllers

**Cours 3** : Les endpoints XtraWork
- GET /api/employees
- POST /api/employees
- PUT /api/employees/{id}
- DELETE /api/employees/{id}

**Etc.**

---

## Comparaison des approches d'auth .NET

### Document : COMPARAISON-APPROCHES(COURS).md

| Critère | JWT Custom | ASP.NET Identity | IdentityServer4 |
|---------|------------|------------------|-----------------|
| **Complexité** | Moyenne | Élevée | Très élevée |
| **Setup** | 2-3h | 4-6h | 8-12h |
| **Contrôle** | Total | Moyen | Total |
| **Base de données** | Optionnelle | Requise | Requise |
| **UI fournie** | Non | Scaffold Razor | Non |
| **OAuth** | À implémenter | Inclus | Inclus |
| **Idéal pour** | API simple | App web MVC | SSO, OAuth provider |

**Votre projet XtraWork utilise** : JWT Custom (le plus simple pour API)

---

## Format des fichiers (comme 14-documentation-2-cours/)

### Modules (COURS)

```markdown
# 01-ARCHITECTURE-CLEAN(COURS).md

## Introduction

L'architecture Clean sépare les responsabilités...

## Couches de l'application

### 1. Controllers
Code, explications...

### 2. Services
Code, explications...

### 3. Repositories
Code, explications...

## Exemple dans XtraWork

```csharp
// Code commenté du projet
```
```

---

### Quiz (OBLIGATOIRE)

**Fichier Questions** : `04-QUIZ-QUESTIONS(OBLIGATOIRE).md`

```markdown
# Quiz - Fondations ASP.NET Core

## Question 1
Quelle est la responsabilité principale d'un Controller ?
a) Accès à la base de données
b) Logique métier
c) Recevoir les requêtes HTTP et retourner des réponses
d) Validation des données

## Question 2
...

## Barème
- 1 point par bonne réponse
- Total : 25 points
```

**Fichier Réponses** : `05-QUIZ-REPONSES(OBLIGATOIRE).md`

```markdown
# Réponses Quiz - Fondations ASP.NET Core

## Question 1
**Réponse correcte** : c) Recevoir les requêtes HTTP et retourner des réponses

**Explication** :
Le Controller est la couche de présentation. Il reçoit les requêtes,
délègue au Service, et retourne des réponses HTTP appropriées.
```

---

### Exercices (OPTIONNEL)

```markdown
# Exercices - Fondations ASP.NET Core

## Exercice 1 : Créer un nouveau Controller

Créez un Controller pour gérer les départements...

## Exercice 2 : Implémenter un Service

...

## Solutions

### Solution Exercice 1
```csharp
// Code complet avec explications
```
```

---

## Spécificités ASP.NET Core à couvrir

### Concepts clés

**Architecture** :
- Clean Architecture
- Separation of Concerns
- Dependency Injection

**Entity Framework** :
- Code First vs Database First
- Migrations
- Relations
- LINQ

**JWT** :
- Génération de tokens
- Validation
- Claims et Roles
- Refresh tokens

**API REST** :
- Routing
- Model Binding
- Validation
- Status codes

**CORS** :
- Configuration
- Policies
- Preflight requests

**Sécurité** :
- HTTPS
- Password hashing (BCrypt)
- SQL Injection prevention
- XSS prevention

---

## Différences avec 14-documentation-2-cours/

| Aspect | 14-documentation-2-cours | 15-cours-aspnetcore (proposition) |
|--------|--------------------------|-----------------------------------|
| **Focus** | Next.js + React | ASP.NET Core + API |
| **Auth** | Clerk/NextAuth | JWT custom |
| **Frontend** | Pages React/Next | Consommation de l'API |
| **Backend** | API Routes Next.js | ASP.NET Core Controllers |
| **ORM** | Prisma | Entity Framework |
| **Validation** | Zod | FluentValidation |
| **Déploiement** | Vercel | Azure/Docker |

---

## Recommandation

### Créer : 15-cours-aspnetcore/

**Structure identique à `14-documentation-2-cours/`** :
- Mêmes marqueurs (COURS), (OBLIGATOIRE), (OPTIONNEL)
- Même organisation par cours
- Même séparation questions/réponses
- Mais **contenu adapté à ASP.NET Core**

**Basé sur votre projet XtraWork** :
- Exemples réels du code existant
- Architecture déjà en place
- Concepts déjà implémentés

**Complémentaire avec frontend-exemples/** :
- `15-cours-aspnetcore/` → Backend
- `frontend-exemples/` → Frontend

---

**Voulez-vous que je crée cette structure de cours ASP.NET Core maintenant ?**

