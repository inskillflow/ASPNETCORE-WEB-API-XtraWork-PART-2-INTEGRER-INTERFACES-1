# Introduction - Services et Repositories

Le Service Layer Pattern et le Repository Pattern sont deux patterns fondamentaux pour structurer une application en couches. Ils separent la logique metier de l'acces aux donnees.

## Service Layer Pattern

Le Service contient la logique metier. C'est le cerveau de l'application.

**Responsabilites** :
- Validation des regles business
- Orchestration de plusieurs repositories
- Transformation des donnees (Entity vers DTO)
- Gestion des transactions complexes

## Repository Pattern

Le Repository abstrait l'acces a la base de donnees. C'est la porte vers les donnees.

**Responsabilites** :
- CRUD de base (Create, Read, Update, Delete)
- Requetes LINQ
- Pas de logique metier

## Dans XtraWork

```
EmployeeController
    → EmployeeService (logique metier)
        → EmployeeRepository (acces donnees)
        → TitleRepository (acces donnees)
            → XtraWorkContext (Entity Framework)
```

**Prochain** : [01-SERVICE-LAYER(COURS).md](./01-SERVICE-LAYER(COURS).md)

