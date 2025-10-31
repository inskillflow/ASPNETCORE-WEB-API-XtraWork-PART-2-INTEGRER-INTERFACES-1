# Module 4 - LINQ Avancé

## Requêtes LINQ dans XtraWork

### Where - Filtrer

```csharp
var hommes = await _context.Employees
    .Where(e => e.Gender == "Homme")
    .ToListAsync();
```

---

### OrderBy - Trier

```csharp
var employees = await _context.Employees
    .OrderBy(e => e.LastName)       // Tri primaire
    .ThenBy(e => e.FirstName)       // Tri secondaire
    .ToListAsync();
```

---

### Select - Projeter

```csharp
var names = await _context.Employees
    .Select(e => new { e.FirstName, e.LastName })
    .ToListAsync();
```

---

### GroupBy - Grouper

```csharp
var byGender = await _context.Employees
    .GroupBy(e => e.Gender)
    .Select(g => new { Gender = g.Key, Count = g.Count() })
    .ToListAsync();
```

---

### Any, Count, First

```csharp
var exists = await _context.Employees.AnyAsync(e => e.Id == id);
var count = await _context.Employees.CountAsync();
var first = await _context.Employees.FirstOrDefaultAsync(e => e.Id == id);
```

---

**Prochain** : [05-PERFORMANCE(COURS).md](./05-PERFORMANCE(COURS).md)

