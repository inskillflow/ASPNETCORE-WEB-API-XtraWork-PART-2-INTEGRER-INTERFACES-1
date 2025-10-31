# Module 4 - Best Practices

## Bonnes pratiques Services et Repositories

### 1. Un Service = Une entite

```csharp
EmployeeService → Gere Employee
TitleService    → Gere Title
AuthService     → Gere authentification
```

Ne pas creer un mega-service qui fait tout.

---

### 2. Repository generique (optionnel)

```csharp
public interface IRepository<T> where T : class
{
    Task<List<T>> GetAllAsync();
    Task<T?> GetByIdAsync(Guid id);
    Task<T> CreateAsync(T entity);
    Task<T> UpdateAsync(T entity);
    Task DeleteAsync(Guid id);
}

public class Repository<T> : IRepository<T> where T : class
{
    protected readonly XtraWorkContext _context;
    
    public Repository(XtraWorkContext context)
    {
        _context = context;
    }
    
    public virtual async Task<List<T>> GetAllAsync()
    {
        return await _context.Set<T>().ToListAsync();
    }
    // ...
}
```

**XtraWork n'utilise pas** cette approche pour garder la simplicite.

---

### 3. Nommer clairement

**Bon** : `GetByTitleIdAsync()`, `SearchByNameAsync()`
**Mauvais** : `Get2()`, `FindStuff()`

---

### 4. Retourner les bonnes exceptions

**Service** :
```csharp
if (!found)
    throw new NotFoundException("Employe non trouve");
```

**Repository** :
```csharp
// Pas d'exception, retourner null
return await _context.Employees.FirstOrDefaultAsync(e => e.Id == id);
```

---

**Prochain** : [05-QUIZ-QUESTIONS(OBLIGATOIRE).md](./05-QUIZ-QUESTIONS(OBLIGATOIRE).md)

