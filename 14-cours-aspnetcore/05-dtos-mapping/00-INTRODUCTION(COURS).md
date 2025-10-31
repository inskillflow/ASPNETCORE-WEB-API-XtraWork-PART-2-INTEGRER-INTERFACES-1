# Introduction - DTOs et Mapping

## Pourquoi des DTOs ?

DTO (Data Transfer Object) = Objet concu pour transferer des donnees entre couches ou systemes.

---

## Probleme : Exposer les entites directement

```csharp
[HttpGet]
public ActionResult<List<Employee>> GetAll()
{
    return Ok(_context.Employees.ToList());  // MAUVAIS
}
```

**Problemes** :
- Expose le mot de passe hash (si User)
- Expose les proprietes internes (audit, timestamps)
- Couplage fort entre DB et API
- References circulaires (Employee.Title.Employees...)

---

## Solution : DTOs separes

**Entity** (base de donnees) :
```csharp
public class Employee
{
    public Guid Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public Guid TitleId { get; set; }
    public Title Title { get; set; }  // Navigation
}
```

**Response DTO** (API) :
```csharp
public class EmployeeResponse
{
    public Guid Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string TitleDescription { get; set; }  // Pas Title complet
}
```

**Avantages** :
- Controle total sur ce qui est expose
- Pas de references circulaires
- Evolution independante

---

**Prochain** : Quiz et exercices

