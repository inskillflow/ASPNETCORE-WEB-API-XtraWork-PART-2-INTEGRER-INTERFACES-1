# Exercices Optionnels - API REST et Controllers

## Exercice 1 : Creer un endpoint de recherche

### Enonce

Ajoutez un endpoint pour rechercher des employes par nom dans EmployeeController.

Route : `GET /api/employees/search?term=dupont`

### Solution

```csharp
[HttpGet("search")]
public async Task<ActionResult<List<EmployeeResponse>>> Search([FromQuery] string term)
{
    if (string.IsNullOrWhiteSpace(term))
    {
        return BadRequest(new { message = "Le terme de recherche est requis" });
    }
    
    var employees = await _employeeService.Search(term);
    return Ok(employees);
}
```

**Dans EmployeeService** :
```csharp
public async Task<List<EmployeeResponse>> Search(string term)
{
    var employees = await _employeeRepository.SearchByNameAsync(term);
    return employees.Select(MapToResponse).ToList();
}
```

**Dans EmployeeRepository** :
```csharp
public async Task<List<Employee>> SearchByNameAsync(string term)
{
    return await _context.Employees
        .Include(e => e.Title)
        .Where(e => 
            e.FirstName.Contains(term) || 
            e.LastName.Contains(term))
        .ToListAsync();
}
```

---

## Exercice 2 : Implementer la pagination

### Enonce

Ajoutez la pagination a l'endpoint GET /api/employees.

### Solution

**1. Creer un modele PagedRequest**

```csharp
public class PagedRequest
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
```

**2. Modifier le controller**

```csharp
[HttpGet]
public async Task<ActionResult<PagedResult<EmployeeResponse>>> GetAll([FromQuery] PagedRequest paging)
{
    var result = await _employeeService.GetAllPaged(paging.Page, paging.PageSize);
    return Ok(result);
}
```

**3. Dans le Service**

```csharp
public async Task<PagedResult<EmployeeResponse>> GetAllPaged(int page, int pageSize)
{
    var totalCount = await _employeeRepository.CountAsync();
    var employees = await _employeeRepository.GetPagedAsync(page, pageSize);
    
    return new PagedResult<EmployeeResponse>
    {
        Data = employees.Select(MapToResponse).ToList(),
        TotalCount = totalCount,
        Page = page,
        PageSize = pageSize,
        TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
    };
}
```

**4. Dans le Repository**

```csharp
public async Task<int> CountAsync()
{
    return await _context.Employees.CountAsync();
}

public async Task<List<Employee>> GetPagedAsync(int page, int pageSize)
{
    return await _context.Employees
        .Include(e => e.Title)
        .OrderBy(e => e.LastName)
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();
}
```

---

## Exercice 3 : Creer un endpoint avec validation custom

### Enonce

Creez un endpoint qui accepte seulement les employes dont la date de naissance est dans les 100 dernieres annees.

### Solution

**1. Validator avec regle personnalisee**

```csharp
public class EmployeeRequestValidator : AbstractValidator<EmployeeRequest>
{
    public EmployeeRequestValidator()
    {
        RuleFor(x => x.BirthDate)
            .Must(BeWithin100Years)
            .WithMessage("La date de naissance doit etre dans les 100 dernieres annees");
    }
    
    private bool BeWithin100Years(DateTime birthDate)
    {
        var hundredYearsAgo = DateTime.Today.AddYears(-100);
        return birthDate >= hundredYearsAgo && birthDate <= DateTime.Today;
    }
}
```

**2. Le controller reste identique**

```csharp
[HttpPost]
public async Task<ActionResult<EmployeeResponse>> Create([FromBody] EmployeeRequest request)
{
    // FluentValidation valide automatiquement
    var response = await _employeeService.Create(request);
    return CreatedAtAction(nameof(Get), new { id = response.Id }, response);
}
```

La validation se fait automatiquement avant d'entrer dans la methode.

---

## Exercice 4 : Implementer un filtre par genre

### Enonce

Ajoutez un filtre optionnel par genre : `GET /api/employees?gender=Homme`

### Solution

```csharp
[HttpGet]
public async Task<ActionResult<List<EmployeeResponse>>> GetAll([FromQuery] string? gender)
{
    List<EmployeeResponse> employees;
    
    if (string.IsNullOrEmpty(gender))
    {
        employees = await _employeeService.GetAll();
    }
    else
    {
        employees = await _employeeService.GetByGender(gender);
    }
    
    return Ok(employees);
}
```

**Dans le Service** :
```csharp
public async Task<List<EmployeeResponse>> GetByGender(string gender)
{
    var employees = await _employeeRepository.GetByGenderAsync(gender);
    return employees.Select(MapToResponse).ToList();
}
```

**Dans le Repository** :
```csharp
public async Task<List<Employee>> GetByGenderAsync(string gender)
{
    return await _context.Employees
        .Include(e => e.Title)
        .Where(e => e.Gender == gender)
        .ToListAsync();
}
```

---

## Exercice 5 : Gerer les erreurs avec middleware custom

### Enonce

Creez un middleware qui log toutes les exceptions et retourne une reponse JSON standardisee.

### Solution

**1. Creer le middleware**

```csharp
public class GlobalErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalErrorHandlingMiddleware> _logger;
    
    public GlobalErrorHandlingMiddleware(
        RequestDelegate next,
        ILogger<GlobalErrorHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }
    
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (NotFoundException ex)
        {
            _logger.LogWarning(ex, "Ressource non trouvee");
            context.Response.StatusCode = 404;
            await WriteJsonResponse(context, ex.Message);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Acces non autorise");
            context.Response.StatusCode = 401;
            await WriteJsonResponse(context, ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur non geree");
            context.Response.StatusCode = 500;
            await WriteJsonResponse(context, "Une erreur interne est survenue");
        }
    }
    
    private async Task WriteJsonResponse(HttpContext context, string message)
    {
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new
        {
            message,
            timestamp = DateTime.UtcNow,
            path = context.Request.Path
        });
    }
}
```

**2. Enregistrer dans Program.cs**

```csharp
app.UseMiddleware<GlobalErrorHandlingMiddleware>();
```

**Avantage** : Toutes les erreurs sont gerees de maniere coherente avec logging automatique.

---

## Conclusion

Ces exercices vous ont permis de :
- Creer des endpoints avec query parameters
- Implementer la pagination
- Creer des validations personnalisees
- Filtrer des donnees
- Gerer les erreurs avec middleware

Vous maitrisez maintenant les Controllers API REST dans ASP.NET Core.

**Cours suivant** : 04-services-repositories

