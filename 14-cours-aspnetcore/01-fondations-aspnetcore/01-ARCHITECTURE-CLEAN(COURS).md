# Module 1 - Architecture Clean

## Introduction

L'architecture Clean sépare l'application en couches distinctes, chacune ayant une responsabilité précise. Cette séparation facilite la maintenance, les tests, et l'évolution du code.

---

## Principe fondamental

**Séparation des responsabilités** : Chaque couche fait une seule chose et le fait bien.

```
┌─────────────────────────────────────┐
│     CONTROLLERS                     │  ← HTTP in, HTTP out
│     (Présentation)                  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     SERVICES                        │  ← Business logic
│     (Logique métier)                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     REPOSITORIES                    │  ← Data access
│     (Accès données)                 │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     ENTITY FRAMEWORK                │  ← ORM
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     SQL SERVER                      │  ← Database
└─────────────────────────────────────┘
```

---

## Couche 1 : Controllers (Présentation)

### Responsabilité

**Recevoir les requêtes HTTP** et **retourner des réponses HTTP**.

C'est tout ! Pas de logique métier, pas d'accès direct à la base de données.

### Exemple : EmployeeController.cs

```csharp
[ApiController]
[Route("api/[controller]")]
public class EmployeeController : ControllerBase
{
    private readonly EmployeeService _employeeService;
    
    public EmployeeController(EmployeeService employeeService)
    {
        _employeeService = employeeService;  // Injection de dépendance
    }
    
    [HttpGet]
    public async Task<ActionResult<List<EmployeeResponse>>> GetAll()
    {
        var employees = await _employeeService.GetAll();  // Déléguer au service
        return Ok(employees);  // Retourner HTTP 200
    }
}
```

**Ce que fait le Controller** :
1. Reçoit la requête HTTP GET sur `/api/employee`
2. Appelle le service
3. Retourne HTTP 200 OK avec les données

**Ce qu'il NE fait PAS** :
- ❌ Logique métier (calculs, règles business)
- ❌ Accès direct à la base de données
- ❌ Mapping complexe

---

## Couche 2 : Services (Logique métier)

### Responsabilité

**Implémenter la logique métier** : validations business, transformations, orchestration.

### Exemple : EmployeeService.cs

```csharp
public class EmployeeService
{
    private readonly EmployeeRepository _employeeRepository;
    private readonly TitleRepository _titleRepository;
    
    public EmployeeService(
        EmployeeRepository employeeRepository,
        TitleRepository titleRepository)
    {
        _employeeRepository = employeeRepository;
        _titleRepository = titleRepository;
    }
    
    public async Task<EmployeeResponse> Create(EmployeeRequest request)
    {
        // LOGIQUE MÉTIER : Vérifier que le titre existe
        var titleExists = await _titleRepository.ExistsAsync(request.TitleId);
        if (!titleExists)
        {
            throw new NotFoundException("Titre non trouvé");
        }
        
        // Créer l'entité
        var employee = new Employee
        {
            Id = Guid.NewGuid(),
            FirstName = request.FirstName,
            LastName = request.LastName,
            // ...
        };
        
        // Déléguer au repository
        var created = await _employeeRepository.CreateAsync(employee);
        
        // Mapper vers Response
        return MapToResponse(created);
    }
}
```

**Ce que fait le Service** :
1. Valide les règles métier (titre doit exister)
2. Crée l'objet Employee
3. Délègue au Repository pour la sauvegarde
4. Transforme Entity → Response DTO

---

## Couche 3 : Repositories (Accès données)

### Responsabilité

**Abstraire l'accès à la base de données**. Fournir des méthodes simples (GetAll, GetById, Create, Update, Delete).

### Exemple : EmployeeRepository.cs

```csharp
public class EmployeeRepository
{
    private readonly XtraWorkContext _context;
    
    public EmployeeRepository(XtraWorkContext context)
    {
        _context = context;
    }
    
    public async Task<List<Employee>> GetAllAsync()
    {
        return await _context.Employees
            .Include(e => e.Title)  // Charger la relation
            .OrderBy(e => e.LastName)
            .ToListAsync();
    }
    
    public async Task<Employee> CreateAsync(Employee employee)
    {
        _context.Employees.Add(employee);
        await _context.SaveChangesAsync();
        return employee;
    }
}
```

**Ce que fait le Repository** :
1. Utilise Entity Framework pour accéder aux données
2. Fournit des méthodes simples et réutilisables
3. Gère les requêtes LINQ

**Ce qu'il NE fait PAS** :
- ❌ Logique métier
- ❌ Validation business
- ❌ Mapping vers DTOs

---

## Pourquoi cette séparation ?

### Avantage 1 : Testabilité

**Sans séparation** :
```csharp
// Controller fait tout → Difficile à tester
public async Task<ActionResult> GetAll()
{
    var employees = await _context.Employees.ToListAsync();  // Direct DB
    // Validation, mapping, etc. tout mélangé
}
```

**Avec séparation** :
```csharp
// Facile de mocker le service
var mockService = new Mock<EmployeeService>();
mockService.Setup(s => s.GetAll()).ReturnsAsync(fakeData);
var controller = new EmployeeController(mockService.Object);
```

---

### Avantage 2 : Réutilisabilité

Le même service peut être utilisé par :
- Un Controller API
- Un Controller MVC
- Une tâche en arrière-plan
- Un autre service

---

### Avantage 3 : Maintenance

Modification de la logique métier = modifier le Service uniquement.

Modification de l'accès données = modifier le Repository uniquement.

**Une seule responsabilité par couche.**

---

## Flow d'une requête complète

### Exemple : GET /api/employees

```
1. HTTP GET /api/employees
   ↓
2. EmployeeController.GetAll()
   ↓
3. _employeeService.GetAll()
   ↓
4. _employeeRepository.GetAllAsync()
   ↓
5. _context.Employees.ToListAsync()
   ↓
6. Entity Framework génère :
   SELECT * FROM Employees e INNER JOIN Titles t ON e.TitleId = t.Id
   ↓
7. SQL Server retourne les données
   ↓
8. EF mappe SQL → objets C# (Employee)
   ↓
9. Repository retourne List<Employee> au Service
   ↓
10. Service mappe Employee → EmployeeResponse
    ↓
11. Controller retourne HTTP 200 OK + JSON
    ↓
12. Client reçoit le JSON
```

**Chaque couche a son rôle précis !**

---

## Dans le projet XtraWork

### Controllers/

```
XtraWork/Controllers/
├── AuthController.cs        # Login, Register, Logout
├── EmployeeController.cs    # CRUD Employés
└── TitleController.cs       # CRUD Titres
```

**Rôle** : Endpoints API

---

### Services/

```
XtraWork/Services/
├── AuthService.cs           # Logique auth (générer JWT, valider)
├── EmployeeService.cs       # Logique employés (validation métier)
└── TitleService.cs          # Logique titres
```

**Rôle** : Business logic

---

### Repositories/

```
XtraWork/Repositories/
├── UserRepository.cs        # Accès table Users
├── EmployeeRepository.cs    # Accès table Employees
├── TitleRepository.cs       # Accès table Titles
└── XtraWorkContext.cs       # DbContext EF Core
```

**Rôle** : Accès données

---

## Points clés à retenir

**1. Un Controller ne fait PAS de logique métier**
```csharp
// MAUVAIS
[HttpGet]
public async Task<ActionResult> GetAll()
{
    var employees = await _context.Employees.ToListAsync();  // Direct DB !
    if (employees.Count > 100) { /* logique métier */ }      // Dans Controller !
    return Ok(employees);
}

// BON
[HttpGet]
public async Task<ActionResult> GetAll()
{
    var employees = await _employeeService.GetAll();  // Déléguer
    return Ok(employees);
}
```

**2. Un Service ne fait PAS de requêtes HTTP**

Le Service travaille avec des objets C#, pas avec HTTP.

**3. Un Repository ne fait PAS de validation métier**

Le Repository fait seulement des CRUD basiques sur la DB.

---

## Conclusion

L'architecture en couches du projet XtraWork permet :
- Code facile à tester
- Chaque partie est indépendante
- Maintenance simplifiée
- Réutilisation du code

**Prochain module** : [02-ENTITY-FRAMEWORK(COURS).md](./02-ENTITY-FRAMEWORK(COURS).md)

