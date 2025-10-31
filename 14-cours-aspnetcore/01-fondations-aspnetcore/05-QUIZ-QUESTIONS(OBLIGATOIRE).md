# Quiz - Fondations ASP.NET Core

## Instructions

**Durée** : 30 minutes
**Barème** : 1 point par bonne réponse / 25 points total
**Seuil de réussite** : 18/25 (72%)

Répondre aux questions suivantes. Les réponses sont dans le fichier `06-QUIZ-REPONSES(OBLIGATOIRE).md`.

---

## Questions

### Question 1
Quelle est la responsabilité principale d'un Controller dans l'architecture Clean ?

a) Accéder directement à la base de données
b) Implémenter la logique métier
c) Recevoir les requêtes HTTP et retourner des réponses HTTP
d) Gérer les migrations Entity Framework

---

### Question 2
Dans le projet XtraWork, quel fichier contient le DbContext ?

a) Program.cs
b) EmployeeRepository.cs
c) XtraWorkContext.cs
d) Employee.cs

---

### Question 3
Qu'est-ce qu'un ORM (Object-Relational Mapper) ?

a) Un outil pour créer des objets en mémoire
b) Un système qui mappe les objets C# vers des tables SQL
c) Un gestionnaire de relations entre employés
d) Un framework pour créer des API REST

---

### Question 4
Quel est le cycle de vie recommandé pour un DbContext dans ASP.NET Core ?

a) Singleton
b) Transient
c) Scoped
d) Static

---

### Question 5
Dans XtraWork, où sont enregistrés les services dans la Dependency Injection ?

a) Dans le constructeur des Controllers
b) Dans Program.cs avec builder.Services.Add...
c) Dans appsettings.json
d) Dans le DbContext

---

### Question 6
Quelle méthode permet d'inclure une relation dans une requête EF Core ?

a) .Join()
b) .Include()
c) .With()
d) .Load()

---

### Question 7
Pourquoi utilise-t-on `AddScoped` pour les Repositories ?

a) Pour avoir une instance unique dans toute l'application
b) Pour créer une nouvelle instance à chaque utilisation
c) Pour avoir une instance par requête HTTP
d) Pour améliorer les performances

---

### Question 8
Que fait la méthode `ToListAsync()` dans EF Core ?

a) Crée une liste vide
b) Exécute la requête LINQ et retourne les résultats
c) Convertit un tableau en liste
d) Sauvegarde les données

---

### Question 9
Dans l'architecture XtraWork, qui est responsable de la validation métier ?

a) Controller
b) Service
c) Repository
d) Entity

---

### Question 10
Qu'est-ce qu'une migration dans Entity Framework ?

a) Un déplacement de données d'une table à une autre
b) Une mise à jour du schéma de la base de données
c) Un changement de serveur de base de données
d) Une sauvegarde de la base de données

---

### Question 11
Quelle annotation indique qu'un endpoint nécessite une authentification JWT ?

a) [Authenticated]
b) [RequireAuth]
c) [Authorize]
d) [Protected]

---

### Question 12
Dans le code `builder.Services.AddScoped<IAuthService, AuthService>()`, que représente `IAuthService` ?

a) L'implémentation concrète
b) L'interface
c) La classe de base
d) Le namespace

---

### Question 13
Quelle commande crée les tables dans SQL Server basées sur vos entités ?

a) dotnet ef migrations add
b) dotnet ef database create
c) dotnet ef database update
d) dotnet ef schema update

---

### Question 14
Que signifie `[FromBody]` dans un paramètre de méthode Controller ?

a) Les données viennent de l'URL
b) Les données viennent du body de la requête HTTP
c) Les données viennent des cookies
d) Les données viennent des headers

---

### Question 15
Pourquoi séparer les Entities des DTOs (Requests/Responses) ?

a) Pour rendre le code plus complexe
b) Pour séparer le modèle de données du modèle de communication API
c) Pour respecter les conventions de nommage
d) Pour améliorer les performances

---

### Question 16
Dans XtraWork, quelle classe contient la logique de génération du JWT ?

a) EmployeeController
b) AuthController
c) AuthService
d) UserRepository

---

### Question 17
Que fait `SaveChangesAsync()` dans Entity Framework ?

a) Sauvegarde un fichier
b) Commit les changements du DbContext vers la base de données
c) Crée une sauvegarde de la base de données
d) Enregistre les logs

---

### Question 18
Quel est l'avantage principal de l'injection par constructeur ?

a) C'est plus rapide
b) C'est obligatoire en ASP.NET Core
c) Cela rend les dépendances explicites et facilite les tests
d) Cela économise de la mémoire

---

### Question 19
Dans une architecture Clean, quelle couche accède directement à la base de données ?

a) Controller
b) Service
c) Repository
d) Entity

---

### Question 20
Que signifie l'annotation `[Required]` sur une propriété d'entité ?

a) La propriété doit être initialisée dans le constructeur
b) La colonne SQL ne peut pas être NULL
c) La propriété est obligatoire pour les tests
d) La propriété doit être unique

---

### Question 21
Quelle interface doit implémenter un DbContext ?

a) IDbContext
b) DbContext est une classe, pas une interface
c) IDatabase
d) IRepository

---

### Question 22
Dans XtraWork, combien de couches y a-t-il entre le Controller et la Database ?

a) 1 (Service)
b) 2 (Service et Repository)
c) 3 (Service, Repository, et Entity Framework)
d) 0 (accès direct)

---

### Question 23
Que fait l'attribut `[MaxLength(50)]` sur une propriété ?

a) Limite la longueur de la propriété à 50 caractères en C# seulement
b) Limite la longueur de la colonne SQL à 50 caractères
c) Crée un index sur la colonne
d) Définit la valeur par défaut

---

### Question 24
Pourquoi utiliser `async/await` dans les méthodes Repository ?

a) C'est obligatoire en ASP.NET Core
b) Pour ne pas bloquer le thread pendant les opérations I/O
c) Pour améliorer la sécurité
d) Pour utiliser moins de mémoire

---

### Question 25
Dans le projet XtraWork, quelle est la relation entre Employee et Title ?

a) Many-to-Many
b) One-to-One
c) Many-to-One (plusieurs employés peuvent avoir le même titre)
d) Aucune relation

---

## Fin du quiz

**Total** : 25 questions

**Barème** :
- 23-25 points : Excellent
- 18-22 points : Bien (seuil de réussite)
- 13-17 points : Passable (à revoir)
- < 13 points : Insuffisant (relire les modules)

---

**Vérifier vos réponses** : [06-QUIZ-REPONSES(OBLIGATOIRE).md](./06-QUIZ-REPONSES(OBLIGATOIRE).md)

