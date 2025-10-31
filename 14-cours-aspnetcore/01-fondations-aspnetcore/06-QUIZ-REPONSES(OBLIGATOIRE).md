# Réponses Quiz - Fondations ASP.NET Core

## Instructions de correction

1 point par bonne réponse / 25 points total

---

## Réponses

### Question 1
**Réponse correcte** : c) Recevoir les requêtes HTTP et retourner des réponses HTTP

**Explication** :
Le Controller est la couche de présentation. Sa seule responsabilité est de recevoir les requêtes HTTP, déléguer au Service, et retourner des réponses HTTP appropriées. Il ne doit pas contenir de logique métier ni accéder directement à la base de données.

---

### Question 2
**Réponse correcte** : c) XtraWorkContext.cs

**Explication** :
XtraWorkContext hérite de DbContext et représente la session avec la base de données. Il se trouve dans le dossier Repositories/ et contient les DbSet pour chaque table.

---

### Question 3
**Réponse correcte** : b) Un système qui mappe les objets C# vers des tables SQL

**Explication** :
ORM (Object-Relational Mapper) est un outil qui fait le pont entre le monde orienté objet (C#) et le monde relationnel (SQL). Entity Framework Core est l'ORM de Microsoft.

---

### Question 4
**Réponse correcte** : c) Scoped

**Explication** :
Le DbContext doit être Scoped (une instance par requête HTTP) pour éviter les problèmes de concurrence. Si c'était Singleton, le même DbContext serait partagé entre toutes les requêtes, causant des erreurs. Si c'était Transient, chaque injection créerait une nouvelle instance, empêchant le partage au sein d'une même requête.

---

### Question 5
**Réponse correcte** : b) Dans Program.cs avec builder.Services.Add...

**Explication** :
La configuration de la Dependency Injection se fait dans Program.cs avec des méthodes comme `builder.Services.AddScoped<>()`, `AddTransient<>()`, ou `AddSingleton<>()`.

---

### Question 6
**Réponse correcte** : b) .Include()

**Explication** :
`.Include()` permet de charger les entités liées dans la même requête (Eager Loading). Exemple : `.Include(e => e.Title)` charge l'employé avec son titre. Sans Include, vous auriez besoin de requêtes supplémentaires (problème N+1).

---

### Question 7
**Réponse correcte** : c) Pour avoir une instance par requête HTTP

**Explication** :
`AddScoped` crée une instance au début de la requête HTTP, la partage pendant toute la durée de la requête, puis la détruit à la fin. C'est parfait pour les Repositories qui dépendent du DbContext (lui-même Scoped).

---

### Question 8
**Réponse correcte** : b) Exécute la requête LINQ et retourne les résultats

**Explication** :
LINQ est construit de manière "lazy" (paresseux). La requête n'est exécutée que quand vous appelez une méthode terminale comme `ToListAsync()`, `FirstOrDefaultAsync()`, `CountAsync()`, etc.

---

### Question 9
**Réponse correcte** : b) Service

**Explication** :
Le Service contient la logique métier. Par exemple, dans `EmployeeService.Create()`, le service vérifie que le titre existe avant de créer l'employé. C'est une règle business qui appartient au Service, pas au Controller ni au Repository.

---

### Question 10
**Réponse correcte** : b) Une mise à jour du schéma de la base de données

**Explication** :
Une migration est un fichier généré par EF Core qui contient les instructions pour modifier le schéma de la base de données (créer/modifier/supprimer tables, colonnes, contraintes). On crée une migration avec `dotnet ef migrations add` et on l'applique avec `dotnet ef database update`.

---

### Question 11
**Réponse correcte** : c) [Authorize]

**Explication** :
L'attribut `[Authorize]` sur un controller ou une méthode indique que l'endpoint nécessite un utilisateur authentifié. ASP.NET Core vérifie le token JWT automatiquement.

---

### Question 12
**Réponse correcte** : b) L'interface

**Explication** :
Dans `AddScoped<IAuthService, AuthService>()`, le premier type (`IAuthService`) est l'interface que les consommateurs demandent, et le deuxième type (`AuthService`) est l'implémentation concrète qui sera instanciée. Cela permet le découplage.

---

### Question 13
**Réponse correcte** : c) dotnet ef database update

**Explication** :
`dotnet ef database update` applique les migrations en attente à la base de données. `dotnet ef migrations add` crée une nouvelle migration mais ne l'applique pas.

---

### Question 14
**Réponse correcte** : b) Les données viennent du body de la requête HTTP

**Explication** :
`[FromBody]` indique à ASP.NET Core de lire les données depuis le corps (body) de la requête HTTP et de les désérialiser en objet C#. Utilisé pour POST et PUT.

---

### Question 15
**Réponse correcte** : b) Pour séparer le modèle de données du modèle de communication API

**Explication** :
Les Entities représentent la structure de la base de données. Les DTOs (Requests/Responses) représentent ce qui est échangé via l'API. Cette séparation permet de changer l'un sans affecter l'autre et d'exposer seulement les données nécessaires.

---

### Question 16
**Réponse correcte** : c) AuthService

**Explication** :
`AuthService.cs` contient la méthode `GenerateJwtToken()` qui crée le token JWT avec les claims de l'utilisateur. Le Controller reçoit le token et le retourne, mais c'est le Service qui le génère.

---

### Question 17
**Réponse correcte** : b) Commit les changements du DbContext vers la base de données

**Explication** :
Quand vous faites `_context.Employees.Add()`, l'employé est ajouté à la session EF Core mais PAS encore en base de données. `SaveChangesAsync()` génère et exécute les commandes SQL INSERT/UPDATE/DELETE pour persister les changements.

---

### Question 18
**Réponse correcte** : c) Cela rend les dépendances explicites et facilite les tests

**Explication** :
L'injection par constructeur rend visible toutes les dépendances d'une classe. Pour les tests, on peut facilement injecter des mocks à la place des vraies implémentations.

---

### Question 19
**Réponse correcte** : c) Repository

**Explication** :
Dans l'architecture Clean, seul le Repository accède directement à la base de données via le DbContext. Le Controller et le Service ne touchent jamais directement la DB.

---

### Question 20
**Réponse correcte** : b) La colonne SQL ne peut pas être NULL

**Explication** :
`[Required]` sur une propriété d'entité indique à EF Core que la colonne SQL correspondante doit être NOT NULL. Entity Framework génère le bon type de colonne lors de la migration.

---

### Question 21
**Réponse correcte** : b) DbContext est une classe, pas une interface

**Explication** :
`DbContext` est une classe abstraite fournie par Entity Framework Core. Votre classe (`XtraWorkContext`) hérite de `DbContext`, elle n'implémente pas une interface.

---

### Question 22
**Réponse correcte** : c) 3 (Service, Repository, et Entity Framework)

**Explication** :
Controller → Service → Repository → Entity Framework → Database. Il y a 3 couches entre le Controller et la Database (Service, Repository, EF Core).

---

### Question 23
**Réponse correcte** : b) Limite la longueur de la colonne SQL à 50 caractères

**Explication** :
`[MaxLength(50)]` est une Data Annotation qui indique à EF Core de créer une colonne SQL avec une limite de longueur (VARCHAR(50) ou NVARCHAR(50)). C'est aussi utilisé pour la validation côté serveur.

---

### Question 24
**Réponse correcte** : b) Pour ne pas bloquer le thread pendant les opérations I/O

**Explication** :
Les opérations de base de données sont des opérations I/O qui prennent du temps. `async/await` permet au thread de faire autre chose pendant que la DB répond, améliorant la scalabilité de l'application.

---

### Question 25
**Réponse correcte** : c) Many-to-One (plusieurs employés peuvent avoir le même titre)

**Explication** :
Un employé a un seul titre (relation Many-to-One du côté Employee), mais un titre peut être assigné à plusieurs employés (relation One-to-Many du côté Title). C'est configuré avec `HasOne(e => e.Title).WithMany(t => t.Employees)`.

---

## Barème

| Score | Appréciation |
|-------|--------------|
| 23-25 | Excellent - Concepts maîtrisés |
| 18-22 | Bien - Seuil de réussite atteint |
| 13-17 | Passable - Relire les modules |
| < 13  | Insuffisant - Recommencer le cours |

---

**Prochain** : [07-EXERCICES(OPTIONNEL).md](./07-EXERCICES(OPTIONNEL).md)

