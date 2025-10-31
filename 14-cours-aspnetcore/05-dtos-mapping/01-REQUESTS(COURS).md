# Module 1 - DTOs Requests

## Request DTOs : Données entrantes

Les Request DTOs représentent les données envoyées par le client vers l'API.

---

## Dans XtraWork/Requests/

### EmployeeRequest.cs

```csharp
public class EmployeeRequest
{
    [Required(ErrorMessage = "Le prénom est obligatoire")]
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
    public Guid TitleId { get; set; }
}
```

**Utilisation** :
```csharp
[HttpPost]
public async Task<ActionResult> Create([FromBody] EmployeeRequest request)
{
    var employee = await _employeeService.Create(request);
    return CreatedAtAction(nameof(Get), new { id = employee.Id }, employee);
}
```

---

## LoginRequest.cs

```csharp
public class LoginRequest
{
    [Required]
    public string Username { get; set; } = string.Empty;
    
    [Required]
    public string Password { get; set; } = string.Empty;
}
```

**Plus simple** car seulement 2 champs.

---

## TitleRequest.cs

```csharp
public class TitleRequest
{
    [Required]
    [MaxLength(100)]
    public string Description { get; set; } = string.Empty;
}
```

**Très simple** car Title n'a qu'une propriété.

---

## Pourquoi des Requests séparés ?

**Séparation Entity/API** :
- Entity peut avoir 20 propriétés
- Request n'expose que ce qui est modifiable par le client
- Sécurité : pas de modification des propriétés internes (Id, CreatedAt)

---

**Prochain** : [02-RESPONSES(COURS).md](./02-RESPONSES(COURS).md)

