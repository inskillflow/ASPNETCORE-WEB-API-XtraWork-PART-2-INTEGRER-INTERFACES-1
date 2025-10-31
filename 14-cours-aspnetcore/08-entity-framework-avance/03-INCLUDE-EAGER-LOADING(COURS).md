# Module 3 - Include et Eager Loading

## Problème N+1 Queries

Sans Include, EF Core fait une requête pour chaque relation :

```csharp
// MAUVAIS - N+1 queries
var employees = await _context.Employees.ToListAsync();  // 1 requête

foreach (var emp in employees)
{
    var title = emp.Title.Description;  // 1 requête par employé !
}
// Total : 1 + N requêtes
```

---

## Solution : Include (Eager Loading)

```csharp
// BON - 1 seule requête avec JOIN
var employees = await _context.Employees
    .Include(e => e.Title)  // Charger la relation
    .ToListAsync();

foreach (var emp in employees)
{
    var title = emp.Title.Description;  // Déjà chargé, pas de requête
}
// Total : 1 requête
```

**SQL généré** :
```sql
SELECT e.*, t.*
FROM Employees e
INNER JOIN Titles t ON e.TitleId = t.Id
```

---

## Dans XtraWork

Tous les repositories utilisent Include :

```csharp
public async Task<List<Employee>> GetAllAsync()
{
    return await _context.Employees
        .Include(e => e.Title)  // Éviter N+1
        .OrderBy(e => e.LastName)
        .ToListAsync();
}
```

---

## Include multiple niveaux

```csharp
var employees = await _context.Employees
    .Include(e => e.Title)
        .ThenInclude(t => t.Department)  // Relation imbriquée
    .ToListAsync();
```

---

**Prochain** : [04-LINQ-AVANCE(COURS).md](./04-LINQ-AVANCE(COURS).md)

