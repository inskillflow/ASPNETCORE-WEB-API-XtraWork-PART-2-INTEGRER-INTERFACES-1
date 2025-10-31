# Exercices Optionnels - Fondations ASP.NET Core

## Introduction

Ces exercices sont **optionnels** mais fortement recommandés pour approfondir votre compréhension. Chaque exercice inclut une solution complète.

---

## Exercice 1 : Créer un nouveau Controller

### Énoncé

Créez un `DepartmentController` pour gérer des départements dans le projet XtraWork.

**Spécifications** :
- Route : `/api/department`
- Méthodes : GET (liste), GET by ID, POST (créer)
- Injecter un `DepartmentService`
- Retourner des `DepartmentResponse`

### Solution

**1. Créer l'entité** : `Entities/Department.cs`

```csharp
using System.ComponentModel.DataAnnotations;

namespace XtraWork.Entities;

public class Department
{
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation
    public ICollection<Title> Titles { get; set; } = new List<Title>();
}
```

---

**2. Créer le DTO Response** : `Responses/DepartmentResponse.cs`

```csharp
namespace XtraWork.Responses;

public class DepartmentResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
```

---

**3. Créer le Repository** : `Repositories/DepartmentRepository.cs`

```csharp
using Microsoft.EntityFrameworkCore;
using XtraWork.Entities;

namespace XtraWork.Repositories;

public class DepartmentRepository
{
    private readonly XtraWorkContext _context;
    
    public DepartmentRepository(XtraWorkContext context)
    {
        _context = context;
    }
    
    public async Task<List<Department>> GetAllAsync()
    {
        return await _context.Departments
            .OrderBy(d => d.Name)
            .ToListAsync();
    }
    
    public async Task<Department?> GetByIdAsync(Guid id)
    {
        return await _context.Departments
            .FirstOrDefaultAsync(d => d.Id == id);
    }
    
    public async Task<Department> CreateAsync(Department department)
    {
        _context.Departments.Add(department);
        await _context.SaveChangesAsync();
        return department;
    }
}
```

---

**4. Créer le Service** : `Services/DepartmentService.cs`

```csharp
using XtraWork.Entities;
using XtraWork.Repositories;
using XtraWork.Responses;

namespace XtraWork.Services;

public class DepartmentService
{
    private readonly DepartmentRepository _departmentRepository;
    
    public DepartmentService(DepartmentRepository departmentRepository)
    {
        _departmentRepository = departmentRepository;
    }
    
    public async Task<List<DepartmentResponse>> GetAll()
    {
        var departments = await _departmentRepository.GetAllAsync();
        return departments.Select(d => new DepartmentResponse
        {
            Id = d.Id,
            Name = d.Name,
            CreatedAt = d.CreatedAt
        }).ToList();
    }
}
```

---

**5. Créer le Controller** : `Controllers/DepartmentController.cs`

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XtraWork.Responses;
using XtraWork.Services;

namespace XtraWork.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DepartmentController : ControllerBase
{
    private readonly DepartmentService _departmentService;
    
    public DepartmentController(DepartmentService departmentService)
    {
        _departmentService = departmentService;
    }
    
    [HttpGet]
    public async Task<ActionResult<List<DepartmentResponse>>> GetAll()
    {
        var departments = await _departmentService.GetAll();
        return Ok(departments);
    }
}
```

---

**6. Enregistrer dans Program.cs**

```csharp
builder.Services.AddScoped<DepartmentRepository>();
builder.Services.AddScoped<DepartmentService>();
```

---

**7. Ajouter DbSet dans XtraWorkContext.cs**

```csharp
public DbSet<Department> Departments { get; set; }
```

---

**8. Créer la migration**

```bash
dotnet ef migrations add AddDepartmentTable
dotnet ef database update
```

---

## Exercice 2 : Implémenter une validation métier

### Énoncé

Dans `EmployeeService.Create()`, ajouter une validation :
- Un employé doit avoir au moins 16 ans
- Si moins de 16 ans, lancer une exception

### Solution

```csharp
public async Task<EmployeeResponse> Create(EmployeeRequest request)
{
    // Vérifier que le titre existe
    var titleExists = await _titleRepository.ExistsAsync(request.TitleId);
    if (!titleExists)
    {
        throw new NotFoundException("Titre non trouvé");
    }
    
    // NOUVELLE VALIDATION : Âge minimum
    var age = DateTime.Today.Year - request.BirthDate.Year;
    if (request.BirthDate.Date > DateTime.Today.AddYears(-age))
    {
        age--;
    }
    
    if (age < 16)
    {
        throw new InvalidOperationException("L'employé doit avoir au moins 16 ans");
    }
    
    // Créer l'employé...
}
```

**Explication** :
Cette validation est dans le Service car c'est une règle métier. Le Controller ne fait que déléguer, et le Repository ne fait que sauvegarder.

---

## Exercice 3 : Créer une méthode de recherche

### Énoncé

Ajouter une méthode dans `EmployeeRepository` pour rechercher des employés par nom.

**Signature** :
```csharp
Task<List<Employee>> SearchByNameAsync(string searchTerm)
```

### Solution

**Dans EmployeeRepository.cs** :

```csharp
public async Task<List<Employee>> SearchByNameAsync(string searchTerm)
{
    return await _context.Employees
        .Include(e => e.Title)
        .Where(e => 
            e.FirstName.Contains(searchTerm) || 
            e.LastName.Contains(searchTerm)
        )
        .OrderBy(e => e.LastName)
        .ToListAsync();
}
```

**SQL généré** :
```sql
SELECT e.*, t.*
FROM Employees e
INNER JOIN Titles t ON e.TitleId = t.Id
WHERE e.FirstName LIKE '%searchTerm%' OR e.LastName LIKE '%searchTerm%'
ORDER BY e.LastName
```

**Utilisation dans le Service** :

```csharp
public async Task<List<EmployeeResponse>> Search(string searchTerm)
{
    var employees = await _employeeRepository.SearchByNameAsync(searchTerm);
    return employees.Select(MapToResponse).ToList();
}
```

---

## Exercice 4 : Ajouter une migration

### Énoncé

Ajouter une propriété `PhoneNumber` à l'entité Employee et créer une migration.

### Solution

**1. Modifier Employee.cs** :

```csharp
[MaxLength(20)]
public string PhoneNumber { get; set; } = string.Empty;
```

---

**2. Créer la migration** :

```bash
dotnet ef migrations add AddPhoneNumberToEmployee
```

**Résultat** : Fichier de migration créé dans `Migrations/`

```csharp
public partial class AddPhoneNumberToEmployee : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<string>(
            name: "PhoneNumber",
            table: "Employees",
            type: "nvarchar(20)",
            maxLength: 20,
            nullable: false,
            defaultValue: "");
    }
    
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(
            name: "PhoneNumber",
            table: "Employees");
    }
}
```

---

**3. Appliquer la migration** :

```bash
dotnet ef database update
```

**Résultat** : Colonne `PhoneNumber` ajoutée à la table Employees

---

**4. Mettre à jour les DTOs** :

```csharp
// EmployeeRequest.cs
[MaxLength(20)]
public string PhoneNumber { get; set; } = string.Empty;

// EmployeeResponse.cs
public string PhoneNumber { get; set; } = string.Empty;
```

---

**5. Mettre à jour le mapping dans EmployeeService** :

```csharp
var employee = new Employee
{
    // ...
    PhoneNumber = request.PhoneNumber,  // Ajouter
};
```

---

## Exercice 5 : Comprendre le flow complet

### Énoncé

Tracer le flow complet de la requête `POST /api/employees` qui crée un nouvel employé.

Lister chaque étape de la requête HTTP jusqu'à la réponse.

### Solution

**Flow complet** :

```
1. Client envoie POST /api/employees
   Body: { "firstName": "Jean", "lastName": "Dupont", ... }
   Header: Authorization: Bearer {jwt_token}

2. ASP.NET Core reçoit la requête
   
3. Middleware CORS vérifie l'origine (UseCors)
   
4. Middleware Authentication décode le JWT (UseAuthentication)
   - Vérifie la signature
   - Extrait les Claims (userId, role, etc.)
   - Crée un ClaimsPrincipal
   
5. Routing trouve EmployeeController.Create()
   
6. Model Binding désérialise le JSON → EmployeeRequest
   
7. FluentValidation valide EmployeeRequest
   - FirstName requis ? ✓
   - LastName requis ? ✓
   - TitleId valide ? ✓
   
8. Middleware Authorization vérifie [Authorize]
   - Token valide ? ✓
   - Utilisateur authentifié ? ✓
   
9. DI Container crée la chaîne de dépendances :
   - Crée XtraWorkContext (Scoped pour cette requête)
   - Crée EmployeeRepository(context)
   - Crée TitleRepository(context)
   - Crée EmployeeService(employeeRepo, titleRepo)
   - Injecte EmployeeService dans EmployeeController

10. Controller.Create() est appelé
    
11. Controller appelle _employeeService.Create(request)
    
12. Service valide la logique métier :
    - Le titre existe ? (appel au TitleRepository)
    
13. Service crée l'entité Employee
    
14. Service appelle _employeeRepository.CreateAsync(employee)
    
15. Repository fait _context.Employees.Add(employee)
    
16. Repository fait await _context.SaveChangesAsync()
    
17. Entity Framework génère le SQL :
    INSERT INTO Employees (Id, FirstName, LastName, ...)
    VALUES (guid, 'Jean', 'Dupont', ...)
    
18. SQL Server exécute l'INSERT
    
19. EF Core récupère l'employé avec le titre (Include)
    
20. Repository retourne Employee au Service
    
21. Service mappe Employee → EmployeeResponse
    
22. Service retourne EmployeeResponse au Controller
    
23. Controller retourne CreatedAtAction()
    - Status : 201 Created
    - Header Location: /api/employees/{id}
    - Body: EmployeeResponse en JSON
    
24. ASP.NET Core sérialise EmployeeResponse en JSON
    
25. HTTP Response envoyé au client
    
26. DI Container détruit les instances Scoped :
    - Dispose EmployeeService
    - Dispose EmployeeRepository
    - Dispose TitleRepository
    - Dispose XtraWorkContext
```

**Chaque couche joue son rôle dans ce flow !**

---

## Conclusion

Ces exercices vous ont permis de :
- ✅ Créer un nouveau Controller complet
- ✅ Implémenter une validation métier
- ✅ Utiliser LINQ pour la recherche
- ✅ Créer et appliquer des migrations
- ✅ Comprendre le flow complet d'une requête

**Vous êtes prêt pour le Cours 2 - JWT Authentification !**

---

**Retour à l'index** : [INDEX.md](./INDEX.md)

**Cours suivant** : `../02-jwt-authentification/INDEX.md`

