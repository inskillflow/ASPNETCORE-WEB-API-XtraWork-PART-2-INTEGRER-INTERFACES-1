# Module 2 - Repository Pattern

## Qu'est-ce qu'un Repository ?

Le Repository est un pattern qui abstrait l'acces a la base de donnees. Il fournit une interface simple pour les operations CRUD sans exposer les details d'Entity Framework.

---

## Structure d'un Repository

```csharp
public class EmployeeRepository
{
    private readonly XtraWorkContext _context;
    
    public EmployeeRepository(XtraWorkContext context)
    {
        _context = context;
    }
    
    // Methodes CRUD de base
    public async Task<List<Employee>> GetAllAsync() { }
    public async Task<Employee?> GetByIdAsync(Guid id) { }
    public async Task<Employee> CreateAsync(Employee employee) { }
    public async Task<Employee> UpdateAsync(Employee employee) { }
    public async Task DeleteAsync(Guid id) { }
    
    // Methodes de requete specifiques
    public async Task<bool> ExistsAsync(Guid id) { }
    public async Task<List<Employee>> GetByTitleIdAsync(Guid titleId) { }
}
```

---

## Responsabilites

**CE QUE fait un Repository** :
- Encapsuler les requetes LINQ
- Fournir des methodes simples (GetAll, GetById, Create, etc.)
- Gerer SaveChangesAsync
- Requetes specifiques au domaine

**CE QUE ne fait PAS un Repository** :
- Validation metier
- Transformation vers DTOs
- Logique complexe
- Appeler d'autres repositories

---

## Exemple complet : EmployeeRepository

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
            .Include(e => e.Title)           // Charger la relation
            .OrderBy(e => e.LastName)
            .ThenBy(e => e.FirstName)
            .ToListAsync();
    }
    
    public async Task<Employee?> GetByIdAsync(Guid id)
    {
        return await _context.Employees
            .Include(e => e.Title)
            .FirstOrDefaultAsync(e => e.Id == id);
    }
    
    public async Task<Employee> CreateAsync(Employee employee)
    {
        _context.Employees.Add(employee);
        await _context.SaveChangesAsync();
        return employee;
    }
    
    public async Task<Employee> UpdateAsync(Employee employee)
    {
        _context.Employees.Update(employee);
        await _context.SaveChangesAsync();
        return employee;
    }
    
    public async Task DeleteAsync(Guid id)
    {
        var employee = await GetByIdAsync(id);
        if (employee != null)
        {
            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
        }
    }
    
    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Employees.AnyAsync(e => e.Id == id);
    }
}
```

---

## Avantages du pattern

**Abstraction** : Le Service ne sait pas qu'on utilise EF Core
**Testabilite** : Facile de mocker le Repository
**Reutilisabilite** : Memes methodes utilisables partout
**Maintenance** : Changement de DB ? Modifier seulement les Repositories

---

**Prochain** : [03-ASYNC-AWAIT(COURS).md](./03-ASYNC-AWAIT(COURS).md)

