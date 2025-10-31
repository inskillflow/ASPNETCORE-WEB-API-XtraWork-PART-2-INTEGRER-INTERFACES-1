# Module 2 - Entity Framework Core

## Qu'est-ce qu'Entity Framework Core ?

Entity Framework Core (EF Core) est un **ORM** (Object-Relational Mapper) qui vous permet de travailler avec une base de données en utilisant des objets C# au lieu d'écrire du SQL.

---

## Sans Entity Framework (SQL pur)

```csharp
// Code complexe et verbeux
using var connection = new SqlConnection(connectionString);
connection.Open();

var command = new SqlCommand(
    "SELECT * FROM Employees WHERE Id = @id", 
    connection
);
command.Parameters.AddWithValue("@id", employeeId);

using var reader = command.ExecuteReader();
if (reader.Read())
{
    var employee = new Employee
    {
        Id = reader.GetGuid(0),
        FirstName = reader.GetString(1),
        LastName = reader.GetString(2),
        // ... mapper toutes les colonnes manuellement
    };
}
```

**Problèmes** :
- Beaucoup de code pour une simple requête
- Risque d'erreurs (typos dans les noms de colonnes)
- Mapping manuel fastidieux
- Gestion manuelle des connexions
- Risque de SQL Injection

---

## Avec Entity Framework Core

```csharp
// Code simple et sûr
var employee = await _context.Employees
    .FirstOrDefaultAsync(e => e.Id == employeeId);
```

**Avantages** :
- Code concis et lisible
- Pas de SQL à écrire
- Mapping automatique SQL → C#
- Protection SQL Injection automatique
- Gestion automatique des connexions

---

## DbContext : Le cœur d'Entity Framework

### Qu'est-ce que DbContext ?

Le DbContext représente une **session avec la base de données**. Il permet de :
- Requêter les données (LINQ)
- Sauvegarder les changements
- Suivre les modifications (change tracking)

### Dans XtraWork : XtraWorkContext.cs

```csharp
public class XtraWorkContext : DbContext
{
    public XtraWorkContext(DbContextOptions<XtraWorkContext> options) : base(options)
    {
    }
    
    // DbSet = Tables de la base de données
    public DbSet<User> Users { get; set; }
    public DbSet<Title> Titles { get; set; }
    public DbSet<Employee> Employees { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configuration des entités
        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            // Relation Employee → Title
            entity.HasOne(e => e.Title)
                  .WithMany(t => t.Employees)
                  .HasForeignKey(e => e.TitleId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
```

---

## DbSet : Représentation d'une table

```csharp
public DbSet<Employee> Employees { get; set; }
```

**Ce que ça signifie** :
- `Employees` = Table "Employees" dans SQL Server
- `DbSet<Employee>` = Collection queryable d'employés
- Vous pouvez faire : `_context.Employees.Where(...)`, `_context.Employees.Add(...)`, etc.

---

## LINQ : Langage de requête

Entity Framework utilise LINQ (Language Integrated Query) pour construire les requêtes SQL.

### Exemples de requêtes

**Récupérer tous les employés** :
```csharp
var employees = await _context.Employees.ToListAsync();
```

**SQL généré** :
```sql
SELECT * FROM Employees
```

---

**Filtrer** :
```csharp
var employees = await _context.Employees
    .Where(e => e.Gender == "Homme")
    .ToListAsync();
```

**SQL généré** :
```sql
SELECT * FROM Employees WHERE Gender = 'Homme'
```

---

**Inclure une relation** :
```csharp
var employees = await _context.Employees
    .Include(e => e.Title)  // Joindre la table Titles
    .ToListAsync();
```

**SQL généré** :
```sql
SELECT e.*, t.*
FROM Employees e
INNER JOIN Titles t ON e.TitleId = t.Id
```

**Avantage** : Pas de N+1 queries !

---

## Migrations : Évolution du schéma

Les migrations permettent de **synchroniser votre code C# avec la base de données**.

### Code First Approach

Dans XtraWork, on utilise **Code First** :
1. Vous définissez les classes C# (Employee, Title, User)
2. EF Core génère les tables SQL
3. Les migrations suivent l'évolution

### Commandes de migration

**Créer une migration** :
```bash
dotnet ef migrations add InitialCreate
```

**Appliquer à la base de données** :
```bash
dotnet ef database update
```

**Résultat** : Tables créées dans SQL Server

---

## Dans le projet XtraWork

### Configuration dans Program.cs

```csharp
// Enregistrer le DbContext
var connectionString = builder.Configuration.GetConnectionString("XtraWork");
builder.Services.AddDbContext<XtraWorkContext>(
    opt => opt.UseSqlServer(connectionString)
);
```

**Ce code** :
- Lit la connection string depuis `appsettings.json`
- Configure EF Core pour utiliser SQL Server
- Enregistre le DbContext dans la DI (Dependency Injection)

---

### Connection String

**appsettings.json** :
```json
{
  "ConnectionStrings": {
    "XtraWork": "Server=.;Database=XtraWork;Trusted_Connection=True;..."
  }
}
```

**Explication** :
- `Server=.` : Serveur local
- `Database=XtraWork` : Nom de la base
- `Trusted_Connection=True` : Authentification Windows

---

## Entités : Classes qui deviennent des tables

### Exemple : Employee.cs

```csharp
public class Employee
{
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(50)]
    public string LastName { get; set; } = string.Empty;
    
    [Required]
    public DateTime BirthDate { get; set; }
    
    [Required]
    [MaxLength(10)]
    public string Gender { get; set; } = string.Empty;
    
    [Required]
    public Guid TitleId { get; set; }  // Foreign Key
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation property
    public Title Title { get; set; } = null!;
}
```

**Devient la table** :
```sql
CREATE TABLE Employees (
    Id uniqueidentifier PRIMARY KEY,
    FirstName nvarchar(50) NOT NULL,
    LastName nvarchar(50) NOT NULL,
    BirthDate datetime2 NOT NULL,
    Gender nvarchar(10) NOT NULL,
    TitleId uniqueidentifier NOT NULL,
    CreatedAt datetime2 NOT NULL,
    FOREIGN KEY (TitleId) REFERENCES Titles(Id)
)
```

**EF Core fait la conversion automatiquement !**

---

## Relations entre entités

### One-to-Many : Title → Employees

Un titre peut avoir plusieurs employés, mais un employé a un seul titre.

**Dans Employee.cs** :
```csharp
public Guid TitleId { get; set; }      // Foreign Key
public Title Title { get; set; }       // Navigation property
```

**Dans Title.cs** :
```csharp
public ICollection<Employee> Employees { get; set; } = new List<Employee>();
```

**Configuration dans OnModelCreating** :
```csharp
entity.HasOne(e => e.Title)           // Un employé a un titre
      .WithMany(t => t.Employees)      // Un titre a plusieurs employés
      .HasForeignKey(e => e.TitleId)   // Clé étrangère
      .OnDelete(DeleteBehavior.Restrict);  // Empêcher suppression si employés liés
```

---

## Avantages d'Entity Framework Core

**1. Productivité**
- Moins de code
- Mapping automatique
- Génération des requêtes SQL

**2. Sécurité**
- Protection SQL Injection automatique
- Paramétrisation des requêtes

**3. Maintenabilité**
- Code C# type-safe
- IntelliSense dans l'IDE
- Refactoring facile

**4. Performance**
- Requêtes optimisées
- Change tracking efficace
- Lazy loading disponible

---

## Résumé

Entity Framework Core est l'ORM qui permet de :
- Travailler avec des objets C# au lieu de SQL
- Mapper automatiquement C# ↔ SQL
- Gérer les migrations
- Simplifier l'accès aux données

**Dans XtraWork** :
- `XtraWorkContext.cs` = Le DbContext
- `Entities/` = Les classes qui deviennent des tables
- Repositories utilisent EF Core pour accéder aux données

---

**Prochain module** : [03-DEPENDENCY-INJECTION(COURS).md](./03-DEPENDENCY-INJECTION(COURS).md)

