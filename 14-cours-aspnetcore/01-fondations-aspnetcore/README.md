# Cours 1 - Fondations ASP.NET Core

## Description

Ce cours couvre les fondations essentielles d'ASP.NET Core en analysant le projet XtraWork : architecture en couches, Entity Framework Core, et Dependency Injection.

---

## Contenu

### Modules de cours (4 modules)

1. **Introduction** - Vue d'ensemble de l'architecture
2. **Architecture Clean** - Controllers → Services → Repositories  
3. **Entity Framework Core** - ORM, DbContext, Migrations
4. **Dependency Injection** - Configuration dans Program.cs
5. **Analyse XtraWork** - Code réel ligne par ligne

---

## Évaluation

### Quiz (OBLIGATOIRE)

**25 questions à choix multiple**

**Barème** : 1 point par bonne réponse / 25 points total

**Seuil de réussite** : 18/25 (72%)

**Fichiers** :
- Questions : `05-QUIZ-QUESTIONS(OBLIGATOIRE).md`
- Réponses : `06-QUIZ-REPONSES(OBLIGATOIRE).md`

---

### Exercices (OPTIONNEL)

**5 exercices pratiques**

**Exercices** :
1. Créer un nouveau Controller
2. Implémenter un Service
3. Créer un Repository
4. Configurer une nouvelle entité
5. Ajouter une nouvelle migration

**Fichier** : `07-EXERCICES(OPTIONNEL).md`

---

## Durée

**Total** : 4-5 heures

- Lecture des modules : 3-4 heures
- Quiz : 30 minutes
- Exercices optionnels : 1 heure

---

## Objectifs d'apprentissage

À la fin de ce cours, vous serez capable de :

- Expliquer l'architecture en couches d'une API ASP.NET Core
- Comprendre le rôle de chaque couche (Controller, Service, Repository)
- Utiliser Entity Framework Core pour accéder aux données
- Configurer la Dependency Injection
- Analyser et comprendre le code du projet XtraWork

---

## Prérequis

### Connaissances

- C# de base (classes, méthodes, interfaces)
- SQL de base (SELECT, INSERT, UPDATE, DELETE)
- Concepts HTTP (GET, POST, PUT, DELETE)

### Outils

- .NET 8 SDK installé
- Visual Studio ou VS Code
- SQL Server ou SQL Server LocalDB

---

## Comment suivre ce cours

### 1. Lire les modules dans l'ordre

Commencer par `INDEX.md` puis suivre les modules numérotés.

### 2. Avoir le projet XtraWork ouvert

Ouvrir `XtraWork/` dans Visual Studio pour suivre les exemples de code.

### 3. Exécuter le projet

```bash
cd XtraWork
dotnet run
```

Tester les endpoints dans Swagger : https://localhost:7033/swagger

### 4. Faire le quiz

Répondre aux questions dans `05-QUIZ-QUESTIONS(OBLIGATOIRE).md`.

### 5. Vérifier vos réponses

Comparer avec `06-QUIZ-REPONSES(OBLIGATOIRE).md`.

### 6. Pratiquer (optionnel)

Faire les exercices dans `07-EXERCICES(OPTIONNEL).md`.

---

## Lien avec le projet XtraWork

Ce cours analyse le code réel de `XtraWork/` :

```
XtraWork/
├── Program.cs                      ← Configuration DI et middleware
├── Controllers/
│   └── EmployeeController.cs      ← Exemple analysé en détail
├── Services/
│   └── EmployeeService.cs         ← Logique métier
├── Repositories/
│   ├── EmployeeRepository.cs      ← Accès données
│   └── XtraWorkContext.cs         ← DbContext EF Core
└── Entities/
    └── Employee.cs                ← Modèle de données
```

---

## Prochains cours

Après avoir terminé ce cours :

**Cours 2** - JWT Authentification
**Cours 3** - API REST et Controllers
**Cours 4** - Services et Repositories (approfondissement)

---

**Commencez maintenant** : [INDEX.md](./INDEX.md)

