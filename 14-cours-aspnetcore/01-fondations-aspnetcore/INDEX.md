# Cours 1 - Fondations ASP.NET Core

## Navigation du cours

### Modules de cours (COURS)

1. [Introduction](./00-INTRODUCTION(COURS).md) - Vue d'ensemble de l'architecture
2. [Architecture Clean](./01-ARCHITECTURE-CLEAN(COURS).md) - Controllers → Services → Repositories
3. [Entity Framework Core](./02-ENTITY-FRAMEWORK(COURS).md) - ORM, DbContext, Migrations
4. [Dependency Injection](./03-DEPENDENCY-INJECTION(COURS).md) - DI dans ASP.NET Core
5. [Analyse XtraWork](./04-ANALYSE-XTRAWORK(COURS).md) - Code réel du projet

### Évaluation

- [Quiz Questions (OBLIGATOIRE)](./05-QUIZ-QUESTIONS(OBLIGATOIRE).md) - 25 questions
- [Quiz Réponses (OBLIGATOIRE)](./06-QUIZ-REPONSES(OBLIGATOIRE).md) - Corrections
- [Exercices (OPTIONNEL)](./07-EXERCICES(OPTIONNEL).md) - 5 exercices pratiques

---

## Durée estimée

**Total** : 4-5 heures
- Modules de cours : 3-4 heures
- Quiz : 30 minutes
- Exercices : 1 heure

---

## Objectifs d'apprentissage

À la fin de ce cours, vous serez capable de :

- ✅ Expliquer l'architecture en couches (Controllers, Services, Repositories)
- ✅ Comprendre le rôle d'Entity Framework Core
- ✅ Utiliser la Dependency Injection
- ✅ Analyser la structure du projet XtraWork
- ✅ Créer votre propre API structurée

---

## Prérequis

- Connaissances de base en C#
- Visual Studio ou VS Code installé
- .NET 8 SDK installé
- SQL Server (LocalDB suffit)

---

## Comment utiliser ce cours

### 1. Lire les modules dans l'ordre

Commencer par `00-INTRODUCTION(COURS).md` et suivre l'ordre numérique.

### 2. Faire le quiz (OBLIGATOIRE)

Ouvrir `05-QUIZ-QUESTIONS(OBLIGATOIRE).md` et répondre aux questions.

### 3. Vérifier vos réponses

Comparer avec `06-QUIZ-REPONSES(OBLIGATOIRE).md`.

### 4. Approfondir (OPTIONNEL)

Faire les exercices dans `07-EXERCICES(OPTIONNEL).md`.

---

## Lien avec le projet XtraWork

Ce cours analyse le code réel de `XtraWork/` :

- `XtraWork/Program.cs` - Configuration
- `XtraWork/Controllers/EmployeeController.cs` - Exemple de Controller
- `XtraWork/Services/EmployeeService.cs` - Exemple de Service
- `XtraWork/Repositories/EmployeeRepository.cs` - Exemple de Repository
- `XtraWork/Repositories/XtraWorkContext.cs` - DbContext

**Tous les concepts sont illustrés avec du code réel !**

---

**Commencez par** : [00-INTRODUCTION(COURS).md](./00-INTRODUCTION(COURS).md)

