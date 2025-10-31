# Module 3 - Async/Await

## Programmation asynchrone

En ASP.NET Core, toutes les operations I/O (base de donnees, fichiers, reseau) doivent etre asynchrones pour la scalabilite.

---

## Sans async (bloquant)

```csharp
public List<Employee> GetAll()
{
    // Thread bloque pendant que la DB repond
    return _context.Employees.ToList();
}
```

**Probleme** : Le thread attend sans rien faire. Avec 1000 requetes simultanees, 1000 threads bloques.

---

## Avec async (non-bloquant)

```csharp
public async Task<List<Employee>> GetAllAsync()
{
    // Thread libere pendant que la DB repond
    return await _context.Employees.ToListAsync();
}
```

**Avantage** : Le thread peut traiter d'autres requetes pendant l'attente DB.

---

## Regles async/await

**1. Methode async retourne Task ou Task<T>**
```csharp
public async Task<List<Employee>> GetAllAsync()
public async Task DeleteAsync(Guid id)
```

**2. Utiliser await sur les operations asynchrones**
```csharp
var employees = await _context.Employees.ToListAsync();
```

**3. Suffixe Async par convention**
```csharp
GetAllAsync()  // Pas GetAll()
CreateAsync()  // Pas Create()
```

---

## Dans XtraWork

Toutes les methodes sont asynchrones :

**Repositories** :
```csharp
public async Task<Employee?> GetByIdAsync(Guid id)
{
    return await _context.Employees.FirstOrDefaultAsync(e => e.Id == id);
}
```

**Services** :
```csharp
public async Task<EmployeeResponse> Get(Guid id)
{
    var employee = await _employeeRepository.GetByIdAsync(id);
    return MapToResponse(employee);
}
```

**Controllers** :
```csharp
[HttpGet("{id}")]
public async Task<ActionResult<EmployeeResponse>> Get(Guid id)
{
    var response = await _employeeService.Get(id);
    return Ok(response);
}
```

---

**Prochain** : [04-BEST-PRACTICES(COURS).md](./04-BEST-PRACTICES(COURS).md)

