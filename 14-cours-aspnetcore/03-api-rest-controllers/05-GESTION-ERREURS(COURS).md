# Module 5 - Gestion des erreurs

## Strategies de gestion d'erreurs

Dans une API, les erreurs doivent etre gerees proprement pour retourner des reponses claires au client.

---

## Approche 1 : try/catch dans chaque methode

### Exemple dans XtraWork

```csharp
[HttpGet("{id}")]
public async Task<ActionResult<EmployeeResponse>> Get(Guid id)
{
    try
    {
        var response = await _employeeService.Get(id);
        return Ok(response);
    }
    catch (NotFoundException ex)
    {
        return NotFound(new { message = ex.Message });
    }
}
```

**Avantage** : Controle precis par methode

**Inconvenient** : Code repetitif

---

## Approche 2 : Middleware global (XtraWork)

### Configuration dans Program.cs

```csharp
app.UseExceptionHandler(options =>
{
    options.Run(async http =>
    {
        var ex = http.Features.Get<IExceptionHandlerFeature>()?.Error;
        if (ex != null)
        {
            http.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            http.Response.ContentType = "application/json";
            await http.Response.WriteAsJsonAsync(new { message = ex.GetBaseException().Message });
        }
    });
});
```

**Ce que ca fait** :
- Intercepte toutes les exceptions non gerees
- Retourne 500 Internal Server Error
- Avec un message JSON coherent

**Avantage** : Gestion centralisee, pas de crash

---

## Exceptions personnalisees

### Dans XtraWork : NotFoundException

```csharp
// Exceptions/NotFoundException.cs
public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message)
    {
    }
}
```

**Usage dans le Service** :
```csharp
public async Task<EmployeeResponse> Get(Guid id)
{
    var employee = await _employeeRepository.GetByIdAsync(id);
    if (employee == null)
    {
        throw new NotFoundException($"Employe avec l'ID {id} non trouve");
    }
    return MapToResponse(employee);
}
```

**Dans le Controller** :
```csharp
try
{
    var employee = await _employeeService.Get(id);
    return Ok(employee);
}
catch (NotFoundException ex)
{
    return NotFound(new { message = ex.Message });
}
```

---

## Autres exceptions personnalisees utiles

### ValidationException

```csharp
public class ValidationException : Exception
{
    public Dictionary<string, string[]> Errors { get; }
    
    public ValidationException(Dictionary<string, string[]> errors)
    {
        Errors = errors;
    }
}
```

**Usage** :
```csharp
if (age < 16)
{
    throw new ValidationException(new Dictionary<string, string[]>
    {
        ["BirthDate"] = new[] { "L'employe doit avoir au moins 16 ans" }
    });
}
```

---

### UnauthorizedException

```csharp
public class UnauthorizedException : Exception
{
    public UnauthorizedException(string message) : base(message)
    {
    }
}
```

**Usage dans AuthService** :
```csharp
if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
{
    throw new UnauthorizedException("Credentials invalides");
}
```

---

## Middleware personnalise

### Exemple : Logger les erreurs

```csharp
public class ErrorLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorLoggingMiddleware> _logger;
    
    public ErrorLoggingMiddleware(RequestDelegate next, ILogger<ErrorLoggingMiddleware> logger)
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
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur non geree");
            
            context.Response.StatusCode = 500;
            context.Response.ContentType = "application/json";
            
            await context.Response.WriteAsJsonAsync(new
            {
                message = "Une erreur interne est survenue",
                requestId = context.TraceIdentifier
            });
        }
    }
}

// Dans Program.cs
app.UseMiddleware<ErrorLoggingMiddleware>();
```

---

## Problem Details (RFC 7807)

Format standardise pour les erreurs API.

### Configuration

```csharp
builder.Services.AddProblemDetails();
```

### Utilisation

```csharp
return Problem(
    detail: "Employe avec l'ID 123 non trouve",
    statusCode: 404,
    title: "Ressource non trouvee"
);
```

**Reponse** :
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.4",
  "title": "Ressource non trouvee",
  "status": 404,
  "detail": "Employe avec l'ID 123 non trouve",
  "traceId": "00-123abc..."
}
```

---

## Logging des erreurs

### Serilog dans XtraWork

```csharp
// Program.cs
builder.Host.UseSerilog((ctx, cfg) =>
{
    cfg.ReadFrom.Configuration(ctx.Configuration)
       .WriteTo.Console()
       .WriteTo.File("logs/xtrawork-.txt", rollingInterval: RollingInterval.Day);
});
```

**Dans le code** :
```csharp
public class EmployeeService
{
    private readonly ILogger<EmployeeService> _logger;
    
    public EmployeeService(ILogger<EmployeeService> logger)
    {
        _logger = logger;
    }
    
    public async Task<EmployeeResponse> Get(Guid id)
    {
        _logger.LogInformation("Recuperation employe {EmployeeId}", id);
        
        try
        {
            var employee = await _employeeRepository.GetByIdAsync(id);
            if (employee == null)
            {
                _logger.LogWarning("Employe {EmployeeId} non trouve", id);
                throw new NotFoundException($"Employe {id} non trouve");
            }
            return MapToResponse(employee);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la recuperation de l'employe {EmployeeId}", id);
            throw;
        }
    }
}
```

**Logs generes** :
```
[INFO] Recuperation employe 3fa85f64-5717-4562-b3fc-2c963f66afa6
[WARN] Employe 3fa85f64-5717-4562-b3fc-2c963f66afa6 non trouve
```

---

## Bonnes pratiques

### 1. Toujours retourner du JSON

**MAUVAIS** :
```csharp
return NotFound("Employe non trouve");  // String brut
```

**BON** :
```csharp
return NotFound(new { message = "Employe non trouve" });  // JSON
```

---

### 2. Messages clairs

**MAUVAIS** :
```csharp
return BadRequest(new { message = "Erreur" });
```

**BON** :
```csharp
return BadRequest(new { message = "Le prenom est requis et ne peut depasser 50 caracteres" });
```

---

### 3. Ne pas exposer les details internes

**MAUVAIS** :
```csharp
catch (SqlException ex)
{
    return StatusCode(500, new { message = ex.Message });
    // "Cannot insert duplicate key in object 'dbo.Employees'"
}
```

**BON** :
```csharp
catch (SqlException ex)
{
    _logger.LogError(ex, "Erreur SQL");
    return StatusCode(500, new { message = "Une erreur est survenue lors de la sauvegarde" });
}
```

**En developpement** : Details OK
**En production** : Messages generiques

---

### 4. Utiliser le bon status code

| Situation | Code correct |
|-----------|--------------|
| Succes avec donnees | 200 OK |
| Ressource creee | 201 Created |
| Succes sans donnees | 204 No Content |
| Donnees invalides | 400 Bad Request |
| Pas connecte | 401 Unauthorized |
| Pas les permissions | 403 Forbidden |
| Ressource introuvable | 404 Not Found |
| Erreur serveur | 500 Internal Server Error |

---

## Resume

Gestion d'erreurs dans ASP.NET Core :
- try/catch dans les controllers
- Middleware UseExceptionHandler pour erreurs globales
- Exceptions personnalisees (NotFoundException)
- Messages JSON clairs
- Logging avec Serilog
- Bon status code HTTP

**Dans XtraWork** :
- try/catch dans chaque methode
- Middleware global pour erreurs non gerees
- NotFoundException pour ressources introuvables
- Logging structure avec Serilog

---

**Prochain** : [06-QUIZ-QUESTIONS(OBLIGATOIRE).md](./06-QUIZ-QUESTIONS(OBLIGATOIRE).md)

