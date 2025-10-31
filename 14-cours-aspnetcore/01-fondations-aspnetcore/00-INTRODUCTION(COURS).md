# Introduction - Fondations ASP.NET Core

## Vue d'ensemble du cours

Bienvenue dans le cours sur les fondations d'ASP.NET Core. Ce cours explore l'architecture du projet XtraWork, une API REST complète avec JWT, Entity Framework, et une structure en couches.

---

## Qu'est-ce qu'ASP.NET Core ?

ASP.NET Core est un framework web open-source et cross-platform développé par Microsoft pour créer des applications web modernes, des API REST, et des microservices.

### Caractéristiques principales

**Cross-platform** : Fonctionne sur Windows, Linux, et macOS

**Performance** : L'un des frameworks web les plus rapides

**Open-source** : Code source disponible sur GitHub

**Moderne** : Intègre les meilleures pratiques (DI, middleware, async/await)

---

## Architecture du projet XtraWork

Le projet XtraWork suit une **architecture en couches** (Clean Architecture) qui sépare les responsabilités :

```
┌─────────────────────────────────────┐
│     CONTROLLERS (Présentation)      │  ← Reçoit HTTP, retourne HTTP
│   EmployeeController.cs             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      SERVICES (Logique métier)      │  ← Business logic
│   EmployeeService.cs                │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│    REPOSITORIES (Accès données)     │  ← Accès DB
│   EmployeeRepository.cs             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   ENTITY FRAMEWORK CORE (ORM)       │  ← Traduction C# ↔ SQL
│   XtraWorkContext.cs                │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│        SQL SERVER (Database)        │  ← Stockage
│   Tables: Users, Employees, Titles  │
└─────────────────────────────────────┘
```

---

## Structure des dossiers XtraWork

```
XtraWork/
├── Controllers/          # Endpoints API (HTTP)
├── Services/             # Logique métier
├── Repositories/         # Accès données
├── Entities/             # Modèles de base de données
├── Requests/             # DTOs entrée
├── Responses/            # DTOs sortie
├── Validators/           # Validation (FluentValidation)
├── Exceptions/           # Exceptions personnalisées
└── Program.cs            # Configuration et démarrage
```

---

## Objectifs de ce cours

À la fin de ce cours, vous comprendrez :

1. **L'architecture en couches** et pourquoi elle est importante
2. **Entity Framework Core** et comment il simplifie l'accès aux données
3. **Dependency Injection** et comment ASP.NET Core la gère
4. **La structure du projet XtraWork** et comment naviguer dedans

---

## Prérequis

Avant de commencer, vous devez :

- Connaître les bases de C# (variables, classes, méthodes)
- Avoir installé .NET 8 SDK
- Avoir Visual Studio ou VS Code
- Avoir SQL Server (LocalDB suffit)

---

## Méthodologie du cours

### Format narratif

Ce cours utilise une approche narrative avec des explications détaillées plutôt que du code sec.

**Exemple** :
Au lieu de simplement montrer :
```csharp
services.AddScoped<EmployeeService>();
```

On explique :
"Pourquoi utilisons-nous AddScoped plutôt que AddSingleton ? Parce que le service dépend du DbContext qui doit être recréé à chaque requête HTTP pour éviter les conflits de threads..."

### Code réel du projet

Tous les exemples viennent du projet XtraWork que vous pouvez exécuter et modifier.

---

## Navigation

**Prochain module** : [01-ARCHITECTURE-CLEAN(COURS).md](./01-ARCHITECTURE-CLEAN(COURS).md)

**Retour à l'index** : [INDEX.md](./INDEX.md)

