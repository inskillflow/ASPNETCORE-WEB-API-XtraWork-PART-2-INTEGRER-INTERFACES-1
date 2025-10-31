# Module 4 - Analyse du Projet XtraWork

## Vue d'ensemble du projet

XtraWork est une API REST complète qui implémente tous les concepts vus dans les modules précédents.

---

## Structure des dossiers

```
XtraWork/
├── Controllers/          # 4 controllers
│   ├── AuthController.cs
│   ├── EmployeeController.cs
│   ├── TitleController.cs
│   └── WeatherForecastController.cs
│
├── Services/             # 3 services
│   ├── AuthService.cs
│   ├── EmployeeService.cs
│   └── TitleService.cs
│
├── Repositories/         # 4 repositories
│   ├── UserRepository.cs
│   ├── EmployeeRepository.cs
│   ├── TitleRepository.cs
│   └── XtraWorkContext.cs
│
├── Entities/             # 3 entités
│   ├── User.cs
│   ├── Employee.cs
│   └── Title.cs
│
├── Requests/             # DTOs entrée
│   ├── LoginRequest.cs
│   ├── RegisterRequest.cs
│   ├── EmployeeRequest.cs
│   └── TitleRequest.cs
│
├── Responses/            # DTOs sortie
│   ├── AuthResponse.cs
│   ├── EmployeeResponse.cs
│   └── TitleResponse.cs
│
├── Validators/           # Validation
│   ├── EmployeeRequestValidator.cs
│   └── TitleRequestValidator.cs
│
├── Exceptions/
│   └── NotFoundException.cs
│
└── Program.cs            # Configuration
```

---

## Analyse de Program.cs

### 1. Configuration du DbContext

```csharp
var connectionString = builder.Configuration.GetConnectionString("XtraWork");
builder.Services.AddDbContext<XtraWorkContext>(
    opt => opt.UseSqlServer(connectionString)
);
```

**Ce code** :
- Lit la connection string depuis appsettings.json
- Configure EF Core pour SQL Server
- Enregistre XtraWorkContext dans la DI

---

### 2. Enregistrement des Repositories

```csharp
builder.Services.AddScoped<TitleRepository>();
builder.Services.AddScoped<EmployeeRepository>();
builder.Services.AddScoped<UserRepository>();
```

**Scoped** : Une instance par requête HTTP

---

### 3. Enregistrement des Services

```csharp
builder.Services.AddScoped<TitleService>();
builder.Services.AddScoped<EmployeeService>();
builder.Services.AddScoped<IAuthService, AuthService>();
```

**Note** : AuthService utilise une interface pour le découplage

---

### 4. Configuration JWT

```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwt["Issuer"],
            ValidateAudience = true,
            ValidAudience = jwt["Audience"],
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
        };
    });
```

**Ce code** : Configure l'authentification JWT (Cours 2)

---

### 5. Configuration CORS

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("NextJsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
```

**Ce code** : Autorise le frontend Next.js à appeler l'API (Cours 6)

---

### 6. Middleware Pipeline

```csharp
app.UseSwagger();           // Documentation API
app.UseSwaggerUI();

app.UseCors("NextJsPolicy");  // CORS avant auth !

app.UseHttpsRedirection();
app.UseAuthentication();    // Vérifier le JWT
app.UseAuthorization();     // Vérifier les permissions

app.MapControllers();       // Activer les controllers
app.Run();
```

**Ordre important** :
1. CORS en premier (pour preflight requests)
2. Authentication avant Authorization
3. MapControllers à la fin

---

## Analyse de EmployeeController

### Code complet commenté

```csharp
[ApiController]                      // Marque comme API controller
[Route("api/[controller]")]          // Route : /api/employee
[Authorize]                           // Nécessite authentification JWT
[Produces("application/json")]        // Retourne du JSON
public class EmployeeController : ControllerBase
{
    private readonly EmployeeService _employeeService;
    
    // Injection du service
    public EmployeeController(EmployeeService employeeService)
    {
        _employeeService = employeeService;
    }
    
    /// <summary>
    /// Récupère tous les employés
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<List<EmployeeResponse>>> GetAll()
    {
        var response = await _employeeService.GetAll();
        return Ok(response);  // HTTP 200
    }
    
    /// <summary>
    /// Crée un nouvel employé
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<EmployeeResponse>> Create([FromBody] EmployeeRequest request)
    {
        try
        {
            var response = await _employeeService.Create(request);
            return CreatedAtAction(nameof(Get), new { id = response.Id }, response);
        }
        catch (NotFoundException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
    
    /// <summary>
    /// Supprime un employé (Manager ou Admin)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Policy = "ManagerOrAdmin")]  // Permission requise
    public async Task<ActionResult> Delete(Guid id)
    {
        try
        {
            await _employeeService.Delete(id);
            return NoContent();  // HTTP 204
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
```

---

## Analyse de EmployeeService

### Code commenté

```csharp
public class EmployeeService
{
    private readonly EmployeeRepository _employeeRepository;
    private readonly TitleRepository _titleRepository;
    
    // Injection des repositories
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
            throw new NotFoundException($"Titre avec l'ID {request.TitleId} non trouvé");
        }
        
        // Créer l'entité
        var employee = new Employee
        {
            Id = Guid.NewGuid(),
            FirstName = request.FirstName,
            LastName = request.LastName,
            BirthDate = request.BirthDate,
            Gender = request.Gender,
            TitleId = request.TitleId,
            CreatedAt = DateTime.UtcNow
        };
        
        // Sauvegarder via le repository
        var createdEmployee = await _employeeRepository.CreateAsync(employee);
        
        // Récupérer avec le titre pour la réponse
        var employeeWithTitle = await _employeeRepository.GetByIdAsync(createdEmployee.Id);
        
        // Mapper vers DTO Response
        return new EmployeeResponse
        {
            Id = employeeWithTitle.Id,
            FirstName = employeeWithTitle.FirstName,
            LastName = employeeWithTitle.LastName,
            BirthDate = employeeWithTitle.BirthDate,
            Gender = employeeWithTitle.Gender,
            TitleId = employeeWithTitle.TitleId,
            TitleDescription = employeeWithTitle.Title.Description,
            CreatedAt = employeeWithTitle.CreatedAt
        };
    }
}
```

**Logique métier** :
1. Valider que le titre existe (règle business)
2. Créer l'employé
3. Sauvegarder
4. Récupérer avec les relations
5. Mapper vers DTO

---

## Analyse de EmployeeRepository

### Code commenté

```csharp
public class EmployeeRepository
{
    private readonly XtraWorkContext _context;
    
    // Injection du DbContext
    public EmployeeRepository(XtraWorkContext context)
    {
        _context = context;
    }
    
    public async Task<List<Employee>> GetAllAsync()
    {
        return await _context.Employees
            .Include(e => e.Title)           // Charger la relation (éviter N+1)
            .OrderBy(e => e.LastName)        // Trier
            .ThenBy(e => e.FirstName)
            .ToListAsync();                  // Exécuter la requête
    }
    
    public async Task<Employee?> GetByIdAsync(Guid id)
    {
        return await _context.Employees
            .Include(e => e.Title)
            .FirstOrDefaultAsync(e => e.Id == id);
    }
    
    public async Task<Employee> CreateAsync(Employee employee)
    {
        _context.Employees.Add(employee);    // Ajouter à la session
        await _context.SaveChangesAsync();   // Sauvegarder en DB
        return employee;
    }
    
    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Employees.AnyAsync(e => e.Id == id);
    }
}
```

**Responsabilité** : Accès données uniquement, pas de logique métier

---

## Flow complet d'une requête

### GET /api/employees

```
1. HTTP GET /api/employees
   ↓
2. [Route] trouve EmployeeController
   ↓
3. DI injecte EmployeeService dans le controller
   ↓
4. Controller appelle _employeeService.GetAll()
   ↓
5. Service appelle _employeeRepository.GetAllAsync()
   ↓
6. Repository fait _context.Employees.Include(e => e.Title).ToListAsync()
   ↓
7. Entity Framework génère le SQL :
   SELECT * FROM Employees e INNER JOIN Titles t ON e.TitleId = t.Id
   ↓
8. SQL Server retourne les données
   ↓
9. EF Core mappe SQL → List<Employee>
   ↓
10. Repository retourne List<Employee> au Service
    ↓
11. Service mappe Employee → EmployeeResponse
    ↓
12. Controller retourne Ok(employeeResponses)
    ↓
13. ASP.NET Core sérialise en JSON
    ↓
14. HTTP 200 OK avec le JSON envoyé au client
```

**Chaque couche joue son rôle !**

---

## Résumé

Le projet XtraWork implémente parfaitement :

✅ **Architecture Clean** - Controllers → Services → Repositories
✅ **Entity Framework Core** - XtraWorkContext, DbSet, LINQ
✅ **Dependency Injection** - Tout configuré dans Program.cs
✅ **Séparation des responsabilités** - Chaque classe a un rôle précis

**Ce projet est un excellent exemple de bonnes pratiques ASP.NET Core !**

---

**Prochain** : [05-QUIZ-QUESTIONS(OBLIGATOIRE).md](./05-QUIZ-QUESTIONS(OBLIGATOIRE).md)

