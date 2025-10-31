# Module 2 - DTOs Responses

## Response DTOs : Données sortantes

Les Response DTOs représentent les données retournées par l'API au client.

---

## EmployeeResponse.cs

```csharp
public class EmployeeResponse
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime BirthDate { get; set; }
    public string Gender { get; set; } = string.Empty;
    public Guid TitleId { get; set; }
    public string TitleDescription { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    
    // Propriété calculée
    public int Age => DateTime.Today.Year - BirthDate.Year;
}
```

**Différences avec Employee (Entity)** :
- Pas de navigation property `Title` (évite références circulaires)
- Ajout de `TitleDescription` (string au lieu d'objet)
- Propriété calculée `Age`
- Exposition contrôlée

---

## AuthResponse.cs

```csharp
public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public UserResponse User { get; set; } = new();
}

public class UserResponse
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}
```

**UserResponse** : Pas de PasswordHash exposé (sécurité)

---

**Prochain** : [03-MAPPING(COURS).md](./03-MAPPING(COURS).md)

