# Cours ASP.NET Core - Guide Complet

## Vue d'ensemble

Ce dossier contient 10 cours complets sur ASP.NET Core, JWT, Entity Framework, et le déploiement. Plus de 350 pages de contenu pédagogique basé sur le projet XtraWork.

---

## Guide des Cours

### COURS 1 - Fondations ASP.NET Core
**Dossier** : [01-fondations-aspnetcore/](./01-fondations-aspnetcore/)

**Sujets couverts** :
- Architecture Clean (Controllers → Services → Repositories)
- Entity Framework Core (ORM, DbContext, Migrations)
- Dependency Injection (AddScoped, AddTransient, AddSingleton)
- Pattern Repository et Service Layer

**Format** :
- 4 modules de cours narratifs
- 25 questions à choix multiple
- 5 exercices pratiques avec code XtraWork

**Durée** : 4-5 heures

---

### COURS 2 - JWT Authentification
**Dossier** : [02-jwt-authentification/](./02-jwt-authentification/)

**Sujets couverts** :
- Anatomie d'un JWT (header.payload.signature)
- Configuration JWT dans ASP.NET Core (AddAuthentication)
- Génération de tokens (JwtSecurityTokenHandler)
- Validation et Claims (ClaimTypes, ClaimsPrincipal)
- Refresh tokens et sécurité
- Implémentation dans XtraWork/AuthService.cs

**Format** :
- 6 modules de cours narratifs
- 30 questions à choix multiple
- 6 exercices pratiques

**Durée** : 5-6 heures

**Point clé** : Code réel du projet XtraWork analysé ligne par ligne

---

### COURS 3 - API REST et Controllers
**Dossier** : [03-api-rest-controllers/](./03-api-rest-controllers/)

**Sujets couverts** :
- Routing ([Route], [HttpGet], [HttpPost], [HttpPut], [HttpDelete])
- Model Binding ([FromBody], [FromRoute], [FromQuery])
- Validation (FluentValidation, DataAnnotations)
- Réponses HTTP (Ok(), NotFound(), CreatedAtAction(), BadRequest())
- Gestion d'erreurs globale (UseExceptionHandler)
- Analyse complète de EmployeeController.cs

**Format** :
- 6 modules de cours narratifs
- 25 questions à choix multiple
- 5 exercices pratiques

**Durée** : 4-5 heures

---

### COURS 4 - Services et Repositories
**Dossier** : [04-services-repositories/](./04-services-repositories/)

**Sujets couverts** :
- Pattern Service Layer (pourquoi et comment)
- Pattern Repository (abstraction de la couche données)
- Unit of Work (gestion des transactions)
- Async/Await en profondeur
- Injection de dépendances
- Code réel : EmployeeService.cs et EmployeeRepository.cs

**Format** :
- 5 modules de cours narratifs
- 20 questions à choix multiple
- 4 exercices pratiques

**Durée** : 3-4 heures

---

### COURS 5 - DTOs et Mapping
**Dossier** : [05-dtos-mapping/](./05-dtos-mapping/)

**Sujets couverts** :
- Pourquoi des DTOs (séparation Entity/API)
- Requests (EmployeeRequest, LoginRequest)
- Responses (EmployeeResponse, AuthResponse)
- Mapping manuel vs AutoMapper
- Validation des DTOs (FluentValidation)
- Analyse des Requests/ et Responses/ de XtraWork

**Format** :
- 5 modules de cours narratifs
- 20 questions à choix multiple
- 4 exercices pratiques

**Durée** : 3-4 heures

---

### COURS 6 - CORS et Sécurité
**Dossier** : [06-cors-securite/](./06-cors-securite/)

**Sujets couverts** :
- Comprendre CORS (Same-Origin Policy, Preflight)
- Configuration CORS dans ASP.NET Core (AddCors, UseCors)
- Ordre du middleware (UseCors avant UseAuthorization)
- HTTPS et certificats SSL
- Sécurité API (rate limiting, protection attaques)
- Configuration dans XtraWork/Program.cs

**Format** :
- 5 modules de cours narratifs
- 25 questions à choix multiple
- 5 exercices pratiques

**Durée** : 4-5 heures

**Point clé** : Pourquoi le frontend peut appeler l'API

---

### COURS 7 - Swagger et Documentation
**Dossier** : [07-swagger-documentation/](./07-swagger-documentation/)

**Sujets couverts** :
- OpenAPI Specification (qu'est-ce que c'est)
- Swashbuckle dans ASP.NET Core (AddSwaggerGen)
- Documenter vos endpoints (annotations XML, ProducesResponseType)
- Swagger UI (tester l'API)
- Sécurité JWT dans Swagger (AddSecurityDefinition)
- Configuration dans XtraWork/Program.cs

**Format** :
- 4 modules de cours narratifs
- 15 questions à choix multiple
- 3 exercices pratiques

**Durée** : 2-3 heures

---

### COURS 8 - Entity Framework Avancé
**Dossier** : [08-entity-framework-avance/](./08-entity-framework-avance/)

**Sujets couverts** :
- Migrations (Add-Migration, Update-Database, db push)
- Relations (One-to-Many : Employee → Title)
- Include et Eager Loading (éviter N+1 queries)
- LINQ avancé (Where, Select, OrderBy, Include)
- Configuration du modèle (Fluent API dans OnModelCreating)
- Code réel : XtraWorkContext.cs

**Format** :
- 6 modules de cours narratifs
- 25 questions à choix multiple
- 5 exercices pratiques

**Durée** : 4-5 heures

---

### COURS 9 - Tests et Qualité
**Dossier** : [09-testing-aspnetcore/](./09-testing-aspnetcore/)

**Sujets couverts** :
- Tests unitaires (xUnit, Moq pour les dépendances)
- Tests d'intégration (WebApplicationFactory)
- Tester les Controllers (mocker les services)
- Tester les Services (mocker les repositories)
- Test-Driven Development (TDD)
- Créer des tests pour XtraWork

**Format** :
- 5 modules de cours narratifs
- 20 questions à choix multiple
- 5 exercices pratiques

**Durée** : 4-5 heures

---

### COURS 10 - Déploiement et Production
**Dossier** : [10-deploiement-production/](./10-deploiement-production/)

**Sujets couverts** :
- Configuration (appsettings.json, appsettings.Production.json)
- Variables d'environnement (User Secrets, Azure Key Vault)
- Docker (Dockerfile, docker-compose)
- Déploiement Azure (App Service, SQL Database)
- CI/CD (GitHub Actions, Azure DevOps)
- Monitoring et logging (Serilog en production)

**Format** :
- 6 modules de cours narratifs
- 20 questions à choix multiple
- 4 exercices pratiques

**Durée** : 3-4 heures

---

## Organisation des fichiers

Chaque cours contient :
- `00-INTRODUCTION(COURS).md` à `0X-MODULE(COURS).md` - Modules de cours
- `0X-QUIZ-QUESTIONS(OBLIGATOIRE).md` - Questions sans réponses
- `0X-QUIZ-REPONSES(OBLIGATOIRE).md` - Corrections détaillées
- `0X-EXERCICES(OPTIONNEL).md` - Exercices pratiques
- `INDEX.md` - Navigation du cours
- `README.md` - Vue d'ensemble

---

## Total du contenu proposé

- **10 cours** complets
- **~50 modules** narratifs
- **~350 pages** de cours
- **~225 questions** de quiz
- **~46 exercices** pratiques
- **38-48 heures** de formation

---

## Parcours recommandé

### Semestre 1 : Backend Fondamental (Cours 1-5)

**Semaines 1-3** : Cours 1 (Fondations)
- Comprendre l'architecture XtraWork
- Controllers, Services, Repositories
- Entity Framework

**Semaines 4-6** : Cours 2 (JWT)
- Authentification
- Génération et validation de tokens
- Code de AuthService.cs

**Semaines 7-9** : Cours 3 (API REST)
- Créer des endpoints
- Routing et validation
- HTTP responses

**Semaines 10-12** : Cours 4-5 (Services/DTOs)
- Logique métier
- Mapping Entity → DTO

---

### Semestre 2 : Backend Avancé (Cours 6-10)

**Semaines 1-3** : Cours 6-7 (CORS/Swagger)
- Connexion Frontend-Backend
- Documentation API

**Semaines 4-6** : Cours 8 (EF Avancé)
- Migrations
- Relations
- Performance

**Semaines 7-9** : Cours 9 (Tests)
- xUnit
- Tests d'intégration

**Semaines 10-12** : Cours 10 (Déploiement)
- Docker
- Azure
- Production

---

## Complémentarité avec frontend-exemples/

```
Projet complet pour enseignement :

Backend → 14-cours-aspnetcore/         (10 cours)
Frontend → frontend-exemples/          (4 exemples fonctionnels)
Documentation → 12-OPTIONS-FRONTEND/   (13 guides)
```

**Couverture totale** : Frontend + Backend + Déploiement

---

**Je vais créer le dossier 14-cours-aspnetcore/ maintenant. Vous pourrez supprimer manuellement 14-documentation-2-cours/ après.**

Voulez-vous que je commence à créer les cours ASP.NET Core ?
